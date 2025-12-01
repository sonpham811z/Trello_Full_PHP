import { experimental_extendTheme as extendTheme } from '@mui/material/styles';

const APP_BAR_HEIGHT = '48px';
const BOARD_BAR_HEIGHT = '40px';
const BOARD_CONTENT_HEIGHT = `calc(100vh - ${APP_BAR_HEIGHT} - ${BOARD_BAR_HEIGHT})`;
const COLUMN_HEADER_HEIGHT = '45px'
const COLUMN_FOOTER_HEIHGHT = '50px'

// Create a theme instance.
const theme = extendTheme({
  trello: {
    appBarHeight: APP_BAR_HEIGHT,
    boardBarHeight: BOARD_BAR_HEIGHT,
    boardContentheight: BOARD_CONTENT_HEIGHT,
    boardHeaderHeight: COLUMN_HEADER_HEIGHT,
    boardFooterHeight: COLUMN_FOOTER_HEIHGHT
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#1976d2', // Blue
        },
        secondary: {
          main: '#000', 
        },
        tertiary: {
          main: '#ff0000'
        },
        text: {
          primary: '#1976d2' 
        },
        background: {
          default: '#f5f5f5', // Light background
        },
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              '*::-webkit-scrollbar': {
                width: '3px',
                height: '3px',
              },
              '*::-webkit-scrollbar-track': {
                marign: '2px'
              },
              '*::-webkit-scrollbar-thumb': {
                backgroundColor: '#e0dede', // Blue for light mode
              },
              '*::-webkit-scrollbar-thumb:hover': {
                backgroundColor: '#005bb5', // Darker blue on hover
              },
            },
          },
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: '#717e82', // Xám xanh nhẹ cho primary
        },
        secondary: {
          main: '#eceff1', // Màu sáng hơn để tạo độ tương phản
        },
        tertiary: {
          main: '#ff6f61', // Đỏ cam nổi bật
        },
        background: {
          default: '#0a0e14', // Đậm hơn 0d1117, gần như đen nhưng vẫn có chiều sâu
          paper: '#1b222c', // Column sáng hơn nền để tạo sự nổi bật
        },
        text: {
          primary: '#e1e4e6', // Giữ trắng để dễ đọc
          secondary: '#cfd8dc', // Xám xanh nhạt hơn
        },
      },

    
    
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              
              '*::-webkit-scrollbar': {
                width: '3px',
                height: '3px',
              },
              '*::-webkit-scrollbar-thumb': {
                backgroundColor: '#757575', // Grey for dark mode
              },
              '*::-webkit-scrollbar-thumb:hover': {
                backgroundColor: '#616161', // Darker grey on hover
              },
            },
          },
        },
      },
    },
  },
  components: {
    MuiMenu: {
      defaultProps: {
        disableScrollLock: true // Không ẩn scrollbar khi mở Menu
      }
    },
    MuiModal: {
      defaultProps: {
        disableScrollLock: true
      }
    },
    MuiDrawer: {
      defaultProps: {
        disableScrollLock: true
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          // Custom styles for buttons
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.primary.main,
          fontSize: '0.87rem',
         
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
          },
          // '&:hover .MuiOutlinedInput-notchedOutline': {
          //   borderColor: theme.palette.primary.main,
          // },
          // '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          //   borderColor: theme.palette.primary.main,
          // },
        }),
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.primary.main,
          fontSize: '0.87rem',
        }),
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputLabel-root": {
            color: "text.primary" // Màu chữ của label (mặc định)
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "text.secondary" // Màu label khi focus vào ô nhập
          },
          "& .MuiOutlinedInput-root": {
            color: "text.primary", // Màu chữ khi nhập
            "& fieldset": { borderColor: "text.primary" }, // Màu viền mặc định
            "&:hover fieldset": { borderColor: "text.primary" }, // Màu viền khi hover
            "&.Mui-focused fieldset": { borderColor: "text.primary" } // Màu viền khi focus
          }
        }
      }
    }
  
    
  },
});

export default theme;
