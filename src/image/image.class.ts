import { InjectionToken } from '@angular/core';

export interface ThyImageConfig {
    thyFallback?: string;
    thyLoadingSrc?: string;
}

export const THY_IMAGE_CONFIG = new InjectionToken<ThyImageConfig>('THY_IMAGE_CONFIG');

export const THY_IMAGE_CONFIG_PROVIDER = {
    provide: THY_IMAGE_CONFIG,
    useValue: {
        thyFallback: 'https://img2.baidu.com/it/u=3542924600,3260178656&fm=26&fmt=auto',
        thyLoadingSrc:
            'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01965a57d75e550000012e7e7fd742.gif&refer=http%3A%2F%2Fimg.zcool.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1639650657&t=3db27aa65a8278159aefd3ce3a758c6a'
    }
};
