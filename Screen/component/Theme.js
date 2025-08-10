export const theme = {
  colors: {
    primary: '#4CAF50',
    secondary: '#2196F3',
    accent: '#FFC107',
    background: '#FFFFFF',
    surface: '#F5F7FA',
    error: '#FF5252',
    text: {
      primary: '#1A1A1A',
      secondary: '#757575',
      light: '#FFFFFF'
    },
    border: '#E0E0E0',
    ripple: 'rgba(0, 0, 0, 0.1)'
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4
    }
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold',
      letterSpacing: 0.5
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold',
      letterSpacing: 0.4
    },
    body: {
      fontSize: 16,
      letterSpacing: 0.3
    },
    caption: {
      fontSize: 14,
      letterSpacing: 0.2
    }
  }
};