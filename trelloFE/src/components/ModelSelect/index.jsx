import {  FormControl, MenuItem, Select } from '@mui/material';

import {
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendTheme,
  useColorScheme
 } from '@mui/material/styles';

 import LightModeIcon from '@mui/icons-material/LightMode';
 import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
 import SettingBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import Box from '@mui/material/Box';

function ModelSelect() {
    const {mode,setMode} = useColorScheme();
    const handleChange = (event) => {
      setMode(event.target.value)
    }
  
    return (
      <FormControl sx={{ m: 1, minWidth: 100 }} size="small">
  
        <Select
          labelId="label-select-dark-light-mode"
          id='select-dark-light-mode'
          value={mode}
          onChange={handleChange}
          autoWidth
          MenuProps={{
            disableScrollLock: true,
          }}
          sx={{  fontSize: '0.8rem' , fontWeight: 'bold', color: 'text.primary'}}
          
        >
          <MenuItem value="light">
            <Box style={{display: 'flex', alignItems: 'center', gap:'7px',  fontSize: '0.75rem' , fontWeight: 'bold'}}>
              <LightModeIcon sx={{
                fontSize: 20
              }}/>
                Light
  
            </Box>
          </MenuItem>
          <MenuItem value="dark">
          <Box sx={{display: 'flex', alignItems:'center', gap:1,  fontSize: '0.8rem' , fontWeight: 'bold'}}>
            <DarkModeOutlinedIcon sx={{fontSize: 20}}/>
            Dark
  
          </Box>
  
            </MenuItem>
          <MenuItem value="system">
            <Box sx={{display: 'flex', alignItems:'center', gap:1,  fontSize: '0.8rem' , fontWeight: 'bold'}}>
            <SettingBrightnessIcon sx={{fontSize:20}}/>
            System
            </Box>
          </MenuItem>
  
        </Select>
      </FormControl>
    )
  
  }

export default ModelSelect