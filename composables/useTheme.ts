import { ThemeEnum } from "~/enums/theme.enum";
export const useTheme = () => {
  const theme = ref(ThemeEnum.Light);

  const setTheme = (newTheme: ThemeEnum) => {
    theme.value = newTheme;
    document.documentElement.classList.toggle(
      ThemeEnum.Dark,
      newTheme === ThemeEnum.Dark
    );
    localStorage.setItem("theme", newTheme);
  };

  const toggleTheme = () => {
    const newTheme =
      theme.value === ThemeEnum.Dark ? ThemeEnum.Light : ThemeEnum.Dark;
    setTheme(newTheme);
  };

  onMounted(() => {
    const savedTheme =
      (localStorage.getItem("theme") as ThemeEnum) || ThemeEnum.Light;
    setTheme(savedTheme);
  });

  const isDark = computed(() => theme.value === ThemeEnum.Dark);
  const isLight = computed(() => theme.value === ThemeEnum.Light);

  return { theme, isDark, isLight, toggleTheme };
};
