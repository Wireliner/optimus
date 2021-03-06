import { SidenavContentComponent } from './sidenav/sidenav-content/sidenav-content.component';
import { LayoutComponent } from './layout.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { SidenavHeaderComponent } from './sidenav/sidenav-header/sidenav-header.component';
import { SidenavHeaderHasAccountComponent } from './sidenav/sidenav-header-has-account/sidenav-header-has-account.component';
import { SidenavHeaderNoAccountComponent } from './sidenav/sidenav-header-no-account/sidenav-header-no-account.component';
import { SidenavFooterComponent } from './sidenav/sidenav-footer/sidenav-footer.component';
import { BootstrapUserComponent } from './bootstrap-user/bootstrap-user.component';
import { SidenavContentAppComponent } from './sidenav/sidenav-content-app/sidenav-content-app.component';
import { SidenavContentAppV2Component } from './sidenav/sidenav-content-app-v2/sidenav-content-app-v2.component';

export const containers: any[] = [
  LayoutComponent,
  SidenavComponent,
  SidenavHeaderComponent,
  SidenavHeaderHasAccountComponent,
  SidenavHeaderNoAccountComponent,
  SidenavContentComponent,
  SidenavContentAppComponent,
  SidenavContentAppV2Component,
  SidenavFooterComponent,
  BootstrapUserComponent
];

export * from './layout.component';
export * from './sidenav/sidenav.component';
export * from './sidenav/sidenav-header/sidenav-header.component';
export * from './sidenav/sidenav-footer/sidenav-footer.component';
export * from './sidenav/sidenav-header-has-account/sidenav-header-has-account.component';
export * from './sidenav/sidenav-header-no-account/sidenav-header-no-account.component';
export * from './bootstrap-user/bootstrap-user.component';
export * from './sidenav/sidenav-content/sidenav-content.component';
export * from './sidenav/sidenav-content-app/sidenav-content-app.component';
export * from './sidenav/sidenav-content-app-v2/sidenav-content-app-v2.component';
