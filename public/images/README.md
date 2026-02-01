# Hotel Images Folder Structure

## 📁 **public/images/** - Local Images Folder

अब आप अपनी local images यहाँ store कर सकते हैं और उन्हें website में use कर सकते हैं।

### 📂 **Subfolders:**

#### **1. `menu/` - खाना की तस्वीरें**
- Kullu Siddu, Chana Madra, Paneer Tikka आदि की photos
- Format: JPG, PNG, WebP
- Size: 800x600 pixels recommended
- Naming: `kullu-siddu.jpg`, `chana-madra.jpg`, etc.

#### **2. `rooms/` - कमरे की तस्वीरें**
- Hotel rooms की interior photos
- Format: JPG, PNG, WebP
- Size: 800x600 pixels recommended
- Naming: `classic-heritage-101.jpg`, `deluxe-oasis-102.jpg`, etc.

#### **3. `gallery/` - Gallery Photos**
- Hotel exterior, mountain views, restaurant interior
- Format: JPG, PNG, WebP
- Size: 800x600 pixels recommended
- Naming: `mountain-view-1.jpg`, `restaurant-interior.jpg`, etc.

#### **4. `hero/` - Hero/Main Banner Images**
- Homepage main banner images
- Format: JPG, PNG, WebP
- Size: 1920x1080 pixels recommended
- Naming: `hero-main.jpg`, `hero-secondary.jpg`, etc.

## 🔄 **How to Use Local Images:**

### **Instead of Unsplash URLs, use:**
```typescript
// Old (Unsplash):
image: 'https://images.unsplash.com/photo-123456?auto=format&fit=crop&q=80&w=800'

// New (Local):
image: '/images/menu/kullu-siddu.jpg'
```

## 📝 **Steps to Replace Images:**

1. **अपनी photos download करें** और proper names से save करें
2. **इन्हें appropriate folder में paste करें:**
   - खाना photos → `public/images/menu/`
   - कमरे photos → `public/images/rooms/`
   - Gallery photos → `public/images/gallery/`
   - Hero photos → `public/images/hero/`

3. **mockData.ts file में URLs change करें:**
   ```typescript
   // Menu items के लिए:
   image: '/images/menu/kullu-siddu.jpg'

   // Room items के लिए:
   image: '/images/rooms/classic-heritage-101.jpg'
   ```

4. **App restart करें:** `npm run dev`

## 🎯 **Recommended Image Specifications:**

- **Format:** JPG (smaller size), PNG (transparent), WebP (modern)
- **Quality:** 80-90% compression
- **Menu Images:** 800x600px
- **Room Images:** 800x600px
- **Gallery Images:** 800x600px
- **Hero Images:** 1920x1080px

## 📋 **Sample File Names:**

```
public/images/menu/
├── kullu-siddu.jpg
├── chana-madra.jpg
├── paneer-tikka.jpg
└── sepu-vadi.jpg

public/images/rooms/
├── classic-heritage-101.jpg
├── deluxe-oasis-102.jpg
├── executive-royal-103.jpg
└── imperial-suite-104.jpg

public/images/gallery/
├── mountain-view.jpg
├── restaurant-interior.jpg
├── hotel-exterior.jpg
└── himalayan-landscape.jpg

public/images/hero/
├── hero-main.jpg
└── hero-secondary.jpg
```

## 🚀 **Quick Start:**

1. अपनी images download करें
2. `public/images/` folders में paste करें
3. `services/mockData.ts` में paths update करें
4. `npm run dev` चलाएं

**अब आप अपनी local images easily use कर सकते हैं!** 📸🏨</content>
<parameter name="filePath">c:\Users\nitis\Downloads\hotel-himalayan-crown\public\images\README.md