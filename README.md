# 🛡️ Beta IDS/IPS Monitoring Dashboard

A comprehensive, fully responsive Intrusion Detection/Prevention System (IDS/IPS) monitoring dashboard built with React, TypeScript, and Tailwind CSS.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18-61DAFB.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6.svg)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38B2AC.svg)

---

## ✨ Features

### 🔒 Security Monitoring
- **Real-time Alert Dashboard** - Monitor security alerts as they happen
- **Threat Intelligence** - Track indicators of compromise (IoCs)
- **Rule Management** - Create and manage IDS/IPS rules
- **Network Traffic Analysis** - Monitor and analyze network traffic
- **Cluster Management** - Manage distributed sensor clusters

### 📊 System Management
- **System Health Monitoring** - Track CPU, memory, disk, and network
- **Service Status** - Monitor critical services
- **Performance Metrics** - Real-time performance tracking
- **Report Generation** - Generate security and compliance reports

### 🎨 User Experience
- **Fully Responsive** - Mobile, tablet, and desktop optimized
- **Dark Mode** - Built-in dark mode support
- **Notifications** - Comprehensive notification center
- **Search & Filter** - Advanced filtering on all pages
- **CRUD Operations** - Full create, read, update, delete functionality

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone http://gitlab.betateam.net/betatech/csd/ids/beta-ids-front-end.git

# Navigate to project directory
cd beta-ids-front-end

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8081`

---

## 📱 Pages

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/` | Main overview with security metrics |
| Alerts | `/alerts` | Alert management and monitoring |
| Network Traffic | `/traffic` | Traffic analysis and statistics |
| Rules | `/rules` | IDS/IPS rule management |
| Clusters | `/clusters` | Sensor cluster management |
| Indicators | `/indicators` | Threat intelligence tracking |
| Activity | `/activity` | System activity logs |
| Notifications | `/notifications` | Notification center |
| System Health | `/system-health` | System resource monitoring |
| Reports | `/reports` | Report generation and history |
| Settings | `/settings` | Application configuration |

---

## 🛠️ Tech Stack

### Core
- **React 18** - UI library
- **TypeScript 5** - Type safety
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing

### Styling
- **Tailwind CSS 3** - Utility-first CSS
- **Radix UI** - Accessible component primitives
- **shadcn/ui** - Re-usable components
- **Lucide React** - Icon library

### State & Data
- **TanStack Query** - Server state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Charts & Visualization
- **Recharts** - Chart library
- **Sonner** - Toast notifications

---

## 📐 Architecture

### Project Structure

```
src/
├── components/          # Reusable components
│   ├── ui/             # UI primitives (shadcn/ui)
│   ├── ResponsiveContainer.tsx
│   ├── DashboardLayout.tsx
│   └── ...
├── pages/              # Page components
│   ├── Dashboard.tsx
│   ├── Alerts.tsx
│   ├── Clusters.tsx
│   ├── Indicators.tsx
│   └── ...
├── lib/                # Utilities
│   ├── utils.ts
│   └── responsive.ts
├── hooks/              # Custom hooks
└── App.tsx             # Main app component
```

### Responsive Design System

The application uses a mobile-first responsive design approach:

```
xs:   0px    → Mobile (default)
sm:   640px  → Landscape phones
md:   768px  → Tablets
lg:   1024px → Desktops
xl:   1280px → Large desktops
2xl:  1536px → Extra large screens
```

---

## 🎨 Design System

### Responsive Components

```tsx
import { 
  ResponsiveGrid, 
  ResponsiveStack, 
  ResponsiveHeader 
} from '@/components/ResponsiveContainer';

// Use in your pages
<ResponsiveStack gap="lg">
  <ResponsiveHeader
    title="Page Title"
    subtitle="Description"
    action={<Button>Action</Button>}
  />
  
  <ResponsiveGrid columns={4} gap="md">
    <Card>Item 1</Card>
    <Card>Item 2</Card>
    <Card>Item 3</Card>
    <Card>Item 4</Card>
  </ResponsiveGrid>
</ResponsiveStack>
```

### Color Scheme

- **Primary**: Blue - Main brand color
- **Success**: Green - Positive actions
- **Warning**: Yellow/Orange - Caution
- **Error**: Red - Critical alerts
- **Muted**: Gray - Secondary content

---

## 📚 Documentation

### Quick References
- **[QUICK_START.md](QUICK_START.md)** - Get started in 5 minutes
- **[RESPONSIVE_QUICK_REFERENCE.md](RESPONSIVE_QUICK_REFERENCE.md)** - Copy-paste patterns

### Comprehensive Guides
- **[RESPONSIVE_DESIGN.md](RESPONSIVE_DESIGN.md)** - Complete design guide
- **[RESPONSIVE_VISUAL_GUIDE.md](RESPONSIVE_VISUAL_GUIDE.md)** - Visual examples
- **[FINAL_PROJECT_SUMMARY.md](FINAL_PROJECT_SUMMARY.md)** - Full project overview

### Updates & Changes
- **[UPDATES.md](UPDATES.md)** - Feature updates
- **[RESPONSIVENESS_IMPROVEMENTS.md](RESPONSIVENESS_IMPROVEMENTS.md)** - Detailed changes

---

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://your-api-url
VITE_APP_NAME=Beta IDS
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] All pages load correctly
- [ ] Navigation works on all devices
- [ ] CRUD operations function properly
- [ ] Search and filters work
- [ ] Modals open and close
- [ ] Forms validate correctly
- [ ] Notifications display
- [ ] Dark mode toggles
- [ ] Responsive on mobile, tablet, desktop

---

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Deploy to GitLab Pages

Add `.gitlab-ci.yml`:

```yaml
pages:
  stage: deploy
  script:
    - npm install
    - npm run build
    - mv dist public
  artifacts:
    paths:
      - public
  only:
    - main
```

---

## 🤝 Contributing

### Development Workflow

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a merge request

### Code Style

- Use TypeScript for all new code
- Follow the existing code structure
- Use Tailwind CSS for styling
- Write responsive components
- Add proper TypeScript types

### Commit Messages

```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
chore: Update dependencies
```

---

## 📊 Project Statistics

- **Total Pages**: 12
- **UI Components**: 40+
- **Responsive Components**: 5
- **Lines of Code**: 10,000+
- **Documentation Files**: 8
- **TypeScript Coverage**: 100%

---

## 🎯 Roadmap

### v2.1.0 (Planned)
- [ ] Real-time WebSocket integration
- [ ] Advanced analytics dashboard
- [ ] Multi-user support
- [ ] Role-based access control

### v2.2.0 (Future)
- [ ] Machine learning threat detection
- [ ] API integration
- [ ] Custom themes
- [ ] Mobile app version

---

## 📄 License

This project is proprietary software owned by Beta Team.

---

## 👥 Team

**Beta Team - CSD Division**
- IDS/IPS Development Team

---

## 📞 Support

### Documentation
- Check the documentation files in the root directory
- Review code examples in `src/pages/`
- See component usage in `src/components/`

### Issues
- Report issues on GitLab
- Contact the development team

---

## 🙏 Acknowledgments

- **shadcn/ui** - For the excellent component library
- **Tailwind CSS** - For the utility-first CSS framework
- **Radix UI** - For accessible component primitives
- **Lucide** - For the beautiful icon set

---

## 📈 Version History

### v2.0.0 (Current)
- Complete responsive design system
- 4 new pages (Clusters, Indicators, System Health, Reports)
- Enhanced notification system
- Fixed all console warnings
- Comprehensive documentation

### v1.0.0
- Initial release
- Basic dashboard
- Alert management
- Traffic monitoring
- Rule management

---

**Built with ❤️ by Beta Team**

🛡️ **Securing networks, one alert at a time**
