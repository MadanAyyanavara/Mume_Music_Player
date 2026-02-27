import { usePlayerStore } from "@/store";
import { LIGHT_COLORS, DARK_COLORS } from "@/theme";

export const useTheme = () => {
    const theme = usePlayerStore((state) => state.theme);
    const colors = theme === 'dark' ? DARK_COLORS : LIGHT_COLORS;
    const isDark = theme === 'dark';

    return { colors, isDark, theme };
};
