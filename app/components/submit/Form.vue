<script setup lang="ts">
import { Smile, ImageIcon, Bold, Italic, Strikethrough, Quote, List, ListOrdered, Code, Link2, Eye, HelpCircle, Loader2, Sparkles } from 'lucide-vue-next';
import { cn } from '~/utils';

interface CategoryOption {
  value: string;
  label: string;
}

interface TagOption {
  value: string;
  label: string;
}

interface Props {
  categories: CategoryOption[];
  tags: TagOption[];
}

defineProps<Props>();

const config = useRuntimeConfig();
const route = useRoute();
const isSubmitting = ref(false);
const isUploading = ref(false);
const isAnalyzing = ref(false);
const uploadError = ref('');
const analyzeError = ref('');

const pricePlanFromQuery = computed<'free' | 'pro' | 'sponsor'>(() => {
  const plan = route.query.plan;
  if (plan === 'pro' || plan === 'sponsor' || plan === 'free') return plan;
  return 'free';
});

// Form data
const formData = reactive({
  link: '',
  name: '',
  categories: [] as string[],
  tags: [] as string[],
  description: '',
  introduction: '',
  iconId: '',
  iconUrl: '',
  imageId: '',
  imageUrl: '',
});

// Form validation errors
const errors = reactive({
  link: '',
  name: '',
  categories: '',
  description: '',
});

// Check if URL is valid
const isValidUrl = computed(() => {
  return formData.link && /^https?:\/\/.+\..+/.test(formData.link);
});

// Validate form
function validateForm(): boolean {
  let isValid = true;
  errors.link = '';
  errors.name = '';
  errors.categories = '';
  errors.description = '';

  if (!formData.link) {
    errors.link = 'Link is required';
    isValid = false;
  } else if (!/^https?:\/\/.+/.test(formData.link)) {
    errors.link = 'Please enter a valid URL';
    isValid = false;
  }

  if (!formData.name) {
    errors.name = 'Name is required';
    isValid = false;
  }

  if (formData.categories.length === 0) {
    errors.categories = 'At least one category is required';
    isValid = false;
  }

  if (!formData.description) {
    errors.description = 'Description is required';
    isValid = false;
  }

  return isValid;
}

// AI auto-fill function
async function handleAIAnalyze() {
  if (!formData.link) {
    errors.link = 'Please enter a URL first';
    return;
  }

  if (!/^https?:\/\/.+/.test(formData.link)) {
    errors.link = 'Please enter a valid URL';
    return;
  }

  isAnalyzing.value = true;
  analyzeError.value = '';
  errors.link = '';

  try {
    const response = await $fetch<{ success: boolean; data: any }>('/api/ai/analyze-website', {
      method: 'POST',
      body: { url: formData.link },
    });

    if (response.success && response.data) {
      // Fill form with AI results
      formData.name = response.data.name || formData.name;
      formData.description = response.data.description || formData.description;
      formData.introduction = response.data.introduction || formData.introduction;
      
      // Set icon and image if available
      if (response.data.icon) {
        formData.iconId = response.data.icon._id;
        formData.iconUrl = response.data.icon.url;
      }
      
      if (response.data.image) {
        formData.imageId = response.data.image._id;
        formData.imageUrl = response.data.image.url;
      }

      // Note: Categories and tags need manual selection as they depend on your Sanity data
      // You can enhance this by mapping AI suggestions to your actual category/tag IDs
    }
  } catch (error: any) {
    console.error('AI analyze error:', error);
    analyzeError.value = error.data?.message || 'Failed to analyze website. Please try again.';
  } finally {
    isAnalyzing.value = false;
  }
}

// Handle form submission
async function handleSubmit() {
  if (!validateForm()) return;

  isSubmitting.value = true;
  
  try {
    const response = await $fetch<{ success: boolean; item: any }>('/api/submit', {
      method: 'POST',
      body: {
        link: formData.link,
        name: formData.name,
        categories: formData.categories,
        tags: formData.tags,
        description: formData.description,
        introduction: formData.introduction,
        icon: formData.iconId || undefined,
        image: formData.imageId || undefined,
        pricePlan: pricePlanFromQuery.value,
      },
    });

    if (response.success) {
      // Navigate to payment page
      navigateTo(`/payment/${response.item._id}`);
    }
  } catch (error: any) {
    console.error('Submit error:', error);
    alert(error.data?.message || 'Failed to submit');
  } finally {
    isSubmitting.value = false;
  }
}

// Upload image to Sanity
async function uploadImage(file: File): Promise<{ _id: string; url: string } | null> {
  const maxSize = 1 * 1024 * 1024; // 1MB
  if (file.size > maxSize) {
    uploadError.value = 'Image size should be less than 1MB';
    return null;
  }

  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  if (!allowedTypes.includes(file.type)) {
    uploadError.value = 'Only PNG and JPEG images are allowed';
    return null;
  }

  try {
    const formDataObj = new FormData();
    formDataObj.append('file', file);

    const response = await $fetch<{ asset: any }>('/api/upload-image', {
      method: 'POST',
      body: formDataObj,
    });

    return {
      _id: response.asset._id,
      url: response.asset.url,
    };
  } catch (error) {
    console.error('Upload error:', error);
    uploadError.value = 'Failed to upload image';
    return null;
  }
}

// Handle icon upload
const iconInput = ref<HTMLInputElement | null>(null);
async function handleIconUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    isUploading.value = true;
    uploadError.value = '';

    const result = await uploadImage(file);
    if (result) {
      formData.iconId = result._id;
      formData.iconUrl = result.url;
    }

    isUploading.value = false;
  }
}

// Handle image upload
const imageInput = ref<HTMLInputElement | null>(null);
async function handleImageUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    isUploading.value = true;
    uploadError.value = '';

    const result = await uploadImage(file);
    if (result) {
      formData.imageId = result._id;
      formData.imageUrl = result.url;
    }

    isUploading.value = false;
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div class="border rounded-xl overflow-hidden shadow-sm">
      <!-- Form content -->
      <div class="p-6 space-y-6">
        <!-- Link and Name -->
        <div class="flex flex-col md:flex-row md:space-x-4 space-y-6 md:space-y-0">
          <!-- Link -->
          <div class="flex-1 space-y-2">
            <label class="text-sm font-medium text-primary">Link</label>
            <div class="flex gap-2">
              <input
                v-model="formData.link"
                type="url"
                placeholder="Enter the link to your product"
                :class="cn(
                  'flex-1 h-10 px-3 rounded-md border bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  errors.link ? 'border-destructive' : 'border-input'
                )"
              />
              <UiButton
                v-if="config.public.supportAiSubmit"
                type="button"
                variant="outline"
                class="h-10 shrink-0 px-3 shadow-none"
                :disabled="!isValidUrl || isAnalyzing || isUploading"
                @click="handleAIAnalyze"
              >
                <Sparkles v-if="!isAnalyzing" class="w-4 h-4 mr-1.5" />
                <Loader2 v-else class="w-4 h-4 mr-1.5 animate-spin" />
                {{ isAnalyzing ? 'Analyzing...' : 'AI Auto-fill' }}
              </UiButton>
            </div>
            <p v-if="errors.link" class="text-sm text-destructive">{{ errors.link }}</p>
            <p v-if="analyzeError" class="text-sm text-destructive">{{ analyzeError }}</p>
          </div>

          <!-- Name -->
          <div class="flex-1 space-y-2">
            <label class="text-sm font-medium text-primary">Name</label>
            <input
              v-model="formData.name"
              type="text"
              placeholder="Enter the name of your product"
              :class="cn(
                'w-full h-10 px-3 rounded-md border bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                errors.name ? 'border-destructive' : 'border-input'
              )"
            />
            <p v-if="errors.name" class="text-sm text-destructive">{{ errors.name }}</p>
          </div>
        </div>

        <!-- Categories and Tags -->
        <div class="flex flex-col md:flex-row md:space-x-4 space-y-6 md:space-y-0">
          <!-- Categories -->
          <div class="flex-1 space-y-2">
            <label class="text-sm font-medium text-primary">Categories</label>
            <UiMultiSelect
              v-model="formData.categories"
              :options="categories"
              placeholder="Select categories"
            />
            <p v-if="errors.categories" class="text-sm text-destructive">{{ errors.categories }}</p>
          </div>

          <!-- Tags -->
          <div class="flex-1 space-y-2">
            <label class="text-sm font-medium text-primary">Tags</label>
            <UiMultiSelect
              v-model="formData.tags"
              :options="tags"
              placeholder="Select tags"
            />
          </div>
        </div>

        <!-- Description -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-primary">Description</label>
          <textarea
            v-model="formData.description"
            placeholder="Enter a brief description of your product"
            rows="2"
            :class="cn(
              'w-full px-3 py-2 rounded-md border bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none',
              errors.description ? 'border-destructive' : 'border-input'
            )"
          />
          <p v-if="errors.description" class="text-sm text-destructive">{{ errors.description }}</p>
        </div>

        <!-- Introduction with Markdown toolbar -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-primary">Introduction</label>
            <span class="text-xs text-muted-foreground">(Markdown supported)</span>
          </div>
          <!-- Markdown Toolbar -->
          <div class="border rounded-t-md bg-muted/30 px-2 py-1 flex items-center gap-1 flex-wrap">
            <button type="button" class="p-1.5 hover:bg-muted rounded" title="Heading">
              <span class="text-sm font-bold">H</span>
            </button>
            <button type="button" class="p-1.5 hover:bg-muted rounded" title="Bold">
              <Bold class="w-4 h-4" />
            </button>
            <button type="button" class="p-1.5 hover:bg-muted rounded" title="Italic">
              <Italic class="w-4 h-4" />
            </button>
            <button type="button" class="p-1.5 hover:bg-muted rounded" title="Strikethrough">
              <Strikethrough class="w-4 h-4" />
            </button>
            <div class="w-px h-4 bg-border mx-1" />
            <button type="button" class="p-1.5 hover:bg-muted rounded" title="Quote">
              <Quote class="w-4 h-4" />
            </button>
            <button type="button" class="p-1.5 hover:bg-muted rounded" title="Unordered List">
              <List class="w-4 h-4" />
            </button>
            <button type="button" class="p-1.5 hover:bg-muted rounded" title="Ordered List">
              <ListOrdered class="w-4 h-4" />
            </button>
            <div class="w-px h-4 bg-border mx-1" />
            <button type="button" class="p-1.5 hover:bg-muted rounded" title="Code">
              <Code class="w-4 h-4" />
            </button>
            <button type="button" class="p-1.5 hover:bg-muted rounded" title="Link">
              <Link2 class="w-4 h-4" />
            </button>
            <button type="button" class="p-1.5 hover:bg-muted rounded" title="Preview">
              <Eye class="w-4 h-4" />
            </button>
            <button type="button" class="p-1.5 hover:bg-muted rounded" title="Help">
              <HelpCircle class="w-4 h-4" />
            </button>
          </div>
          <textarea
            v-model="formData.introduction"
            placeholder="Enter your content here..."
            rows="6"
            class="w-full px-3 py-2 rounded-b-md border border-t-0 border-input bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring font-mono"
          />
        </div>

        <!-- Upload Error -->
        <p v-if="uploadError" class="text-sm text-destructive">{{ uploadError }}</p>

        <!-- Icon and Image Upload -->
        <div class="flex flex-col md:flex-row md:space-x-4 space-y-6 md:space-y-0">
          <!-- Icon Upload -->
          <div class="flex-1 space-y-2">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-primary">Icon</label>
              <span class="text-xs text-muted-foreground">(1:1, PNG or JPEG, max 1MB)</span>
            </div>
            <div
              class="border-2 border-dashed rounded-lg h-[200px] flex flex-col items-center justify-center hover:border-primary/50 transition-colors cursor-pointer"
              @click="!isUploading && iconInput?.click()"
            >
              <input
                ref="iconInput"
                type="file"
                accept="image/png,image/jpeg"
                class="hidden"
                :disabled="isUploading"
                @change="handleIconUpload"
              />
              <!-- Uploading state -->
              <template v-if="isUploading && !formData.iconUrl">
                <Loader2 class="w-10 h-10 text-muted-foreground mb-2 animate-spin" />
                <p class="text-sm text-muted-foreground">Uploading...</p>
              </template>
              <!-- Empty state -->
              <template v-else-if="!formData.iconUrl">
                <ImageIcon class="w-10 h-10 text-muted-foreground mb-2" />
                <p class="text-sm text-muted-foreground">
                  Drag & drop or <span class="text-primary">select image to upload</span>
                </p>
              </template>
              <!-- Uploaded state -->
              <img
                v-else
                :src="formData.iconUrl"
                alt="Icon Preview"
                class="w-full h-full object-contain p-4"
              />
            </div>
          </div>

          <!-- Image Upload -->
          <div class="flex-1 space-y-2">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-primary">Image</label>
              <span class="text-xs text-muted-foreground">(16:9, PNG or JPEG, max 1MB)</span>
            </div>
            <div
              class="border-2 border-dashed rounded-lg h-[200px] flex flex-col items-center justify-center hover:border-primary/50 transition-colors cursor-pointer"
              @click="!isUploading && imageInput?.click()"
            >
              <input
                ref="imageInput"
                type="file"
                accept="image/png,image/jpeg"
                class="hidden"
                :disabled="isUploading"
                @change="handleImageUpload"
              />
              <!-- Uploading state -->
              <template v-if="isUploading && !formData.imageUrl">
                <Loader2 class="w-10 h-10 text-muted-foreground mb-2 animate-spin" />
                <p class="text-sm text-muted-foreground">Uploading...</p>
              </template>
              <!-- Empty state -->
              <template v-else-if="!formData.imageUrl">
                <ImageIcon class="w-10 h-10 text-muted-foreground mb-2" />
                <p class="text-sm text-muted-foreground">
                  Drag & drop or <span class="text-primary">select image to upload</span>
                </p>
              </template>
              <!-- Uploaded state -->
              <img
                v-else
                :src="formData.imageUrl"
                alt="Image Preview"
                class="w-full h-full object-contain p-4"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div
        :class="cn(
          'flex flex-col items-stretch space-y-4 border-t bg-accent px-6 py-4',
          'sm:flex-row sm:justify-between sm:space-y-0 sm:items-center'
        )"
      >
        <UiButton
          type="submit"
          size="lg"
          class="w-full sm:w-auto"
          :disabled="isSubmitting || isUploading"
        >
          <svg
            v-if="isSubmitting"
            class="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          {{ isSubmitting ? 'Submitting...' : 'Submit' }}
        </UiButton>

        <div class="text-sm text-muted-foreground flex items-center justify-center sm:justify-end gap-2">
          <Smile class="h-4 w-4" />
          <span>No worries, <span class="underline">you can change these information later</span>.</span>
        </div>
      </div>
    </div>
  </form>
</template>
