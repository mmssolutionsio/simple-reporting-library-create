/** Element that receives focus when leaving the navigation (browser only). */
export function getMainNavigationElement(desktop: boolean): HTMLElement | null {
  return desktop
    ? document.querySelector<HTMLElement>('#srl-page-navigation > ul')
    : document.querySelector<HTMLElement>('#srl-header__toggle')
}
