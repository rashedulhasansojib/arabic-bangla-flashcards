# Arabic-Bangla Flashcards

A modern, browser-based flashcard application for learning Arabic vocabulary with Bangla translations. Built with Next.js 15, React 19, and TypeScript, featuring intelligent spaced repetition and comprehensive progress tracking.

## 🌟 Features

### Core Learning Features

- **Intelligent Spaced Repetition**: Leitner system with 5 boxes for optimal learning intervals
- **Multiple Quiz Modes**: Multiple choice, type answer, and flashcard modes
- **Session Composition**: Prioritizes incorrect backlog, due words, then new words
- **Progress Tracking**: Comprehensive statistics and learning analytics
- **Local Storage**: All data stored locally in browser - no backend required

### User Experience

- **RTL/LTR Support**: Proper Arabic (RTL) and Bangla (LTR) text rendering
- **Accessibility**: High contrast, keyboard navigation, screen reader support
- **Responsive Design**: Mobile-first design with modern UI components
- **Dark/Light Theme**: System preference detection with manual override
- **Sound Effects**: Optional audio feedback for interactions

### Progress Analytics

- **Streak Tracking**: Current and longest study streaks
- **Accuracy Rate**: Overall performance based on review history
- **Mastery Levels**: Track words from new to mastered
- **Session History**: Detailed study session analytics
- **Achievement System**: Milestone tracking and rewards

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd arabic-bangla-flashcards
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📚 Usage

### Starting Your First Quiz

1. Navigate to the home page
2. Click "Start Quiz" to begin a study session
3. Choose your preferred quiz mode (multiple choice, type answer, or flashcard)
4. Answer questions and track your progress

### Managing Vocabulary

- **Browse Decks**: View and organize your vocabulary collections
- **Progress Tracking**: Monitor your learning journey and achievements
- **Settings**: Customize quiz preferences and data management

### Spaced Repetition System

The app uses a 5-box Leitner system:

- **Box 1**: New words (reviewed daily)
- **Box 2**: 3-day intervals
- **Box 3**: 1-week intervals
- **Box 4**: 2-week intervals
- **Box 5**: 1-month intervals (mastered)

## 🛠️ Technology Stack

### Frontend

- **Next.js 15**: React framework with App Router
- **React 19**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Shadcn/ui**: Modern component library

### Key Libraries

- **Lucide React**: Icon library
- **React Hook Form**: Form management
- **Zod**: Schema validation
- **Class Variance Authority**: Component variants

### Development Tools

- **ESLint**: Code linting
- **TypeScript**: Static type checking
- **PostCSS**: CSS processing

## 📁 Project Structure

```
arabic-bangla-flashcards/
├── app/                    # Next.js App Router pages
│   ├── decks/             # Deck management pages
│   ├── progress/          # Progress tracking page
│   ├── quiz/              # Quiz interface
│   ├── settings/          # Settings page
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── quiz/              # Quiz-specific components
│   └── ui/                # Base UI components
├── lib/                   # Core utilities and data
│   ├── storage.ts         # Local storage management
│   ├── spaced-repetition.ts # Leitner system logic
│   ├── quiz-utils.ts      # Quiz generation utilities
│   └── vocabulary-data.json # Arabic-Bangla vocabulary
├── hooks/                 # Custom React hooks
└── styles/                 # Global styles
```

## 🎯 Key Features Explained

### Session Composition Algorithm

The quiz session follows a priority order:

1. **Outstanding Incorrect Backlog** (up to 5 items)
2. **Additional Due-Today Items** (remaining due words)
3. **Unseen Words** (never attempted)

### Progress Tracking

- **Real-time Statistics**: Live updates during study sessions
- **Historical Data**: Track learning progress over time
- **Performance Metrics**: Accuracy rates and mastery levels
- **Session Analytics**: Detailed study session information

### Data Management

- **Local Storage**: All data stored in browser localStorage
- **Export/Import**: Backup and restore vocabulary data
- **Privacy-First**: No data sent to external servers
- **Offline Capable**: Works without internet connection

## 🔧 Configuration

### Quiz Settings

- **Cards per Session**: 10 (default, configurable)
- **Quiz Mode**: Multiple choice, type answer, or flashcard
- **Transliteration**: Show/hide Arabic transliteration
- **Sound Effects**: Enable/disable audio feedback

### Theme Settings

- **System Preference**: Automatically detect dark/light mode
- **Manual Override**: Force specific theme
- **High Contrast**: Accessibility option

## 📊 Data Structure

### Card Schema

```typescript
interface Card {
	id: string;
	arabic: string;
	bangla: string;
	transliteration?: string;
	module: string;
	box: number; // 1-5 (Leitner system)
	correctCount: number;
	incorrectCount: number;
	lastReviewed?: string;
	nextReview?: string;
}
```

### Progress Schema

```typescript
interface Progress {
	totalCards: number;
	masteredCards: number;
	learningCards: number;
	newCards: number;
	currentStreak: number;
	longestStreak: number;
	lastStudyDate: string | null;
	totalReviews: number;
	accuracyRate: number;
}
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Deploy automatically on push to main branch
3. Environment variables are handled automatically

### Other Platforms

- **Netlify**: Static site deployment
- **GitHub Pages**: Free hosting for public repositories
- **Docker**: Containerized deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Arabic Learning Community**: For vocabulary suggestions and feedback
- **Spaced Repetition Research**: Based on scientific learning principles
- **Open Source Libraries**: Built on amazing open source tools
- **Contributors**: Thanks to all who help improve this project

## 📞 Support

- **Issues**: Report bugs and request features on GitHub Issues
- **Discussions**: Join community discussions on GitHub Discussions
- **Documentation**: Check the docs folder for detailed guides

## 🔮 Roadmap

### Upcoming Features

- [ ] Advanced analytics dashboard
- [ ] Custom vocabulary import
- [ ] Study reminders and notifications
- [ ] Social features and sharing
- [ ] Mobile app (React Native)
- [ ] Offline PWA capabilities

### Performance Improvements

- [ ] Optimized bundle size
- [ ] Faster loading times
- [ ] Better caching strategies
- [ ] Enhanced accessibility

---

**Happy Learning! 🎓**

Start your Arabic vocabulary journey with intelligent spaced repetition and track your progress every step of the way.
