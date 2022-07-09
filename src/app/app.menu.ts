import { MenuItem } from '../fw/services/menu.service';
// import { AppStateService } from './services/app-state.service'
// oh man

// export let foo: AppStateService
import { CurrentCalendarYear, CurrentFiscalYear, Next12Months, NextYear , LastYear } from './common/utilities'

export let _currentCalYear = new CurrentCalendarYear()
export let _CurrentFiscalYer = new CurrentFiscalYear()
export let _next12Months = new Next12Months()
export let _nextYear = new NextYear()
export let _lastYear = new LastYear() 


export let initialMenuItems: Array<MenuItem> = [
  
    {
        text: 'Date Range',
        icon: '	glyphicon-calendar',
        //route: 'null',
        route: '', 
        submenu: [
            {
                text: 'This Year',
                icon: 'glyphicon-calendar',
                route: '/home/resPlans',
                params: {
                    fromDate: _currentCalYear.startDate,
                    toDate: _currentCalYear.endDate
                },
                //submenu: null
                submenu: []
            },
            {
                text: 'Next 12 Months',
                icon: 'glyphicon-calendar',
                route: '/home/resPlans',
                params: {
                    fromDate: _next12Months.startDate,
                    toDate: _next12Months.endDate
                },
                submenu: []
            },
            {
                text: 'Next Year',
                icon: 'glyphicon-calendar',
                route: '/home/resPlans',
                params: {
                    fromDate: _nextYear.startDate,
                    toDate: _nextYear.endDate
                },
                submenu: []
            },
            {
                text: 'Last Year',
                icon: 'glyphicon-calendar',
                route: '/home/resPlans',
                params: {
                    fromDate: _lastYear.startDate,
                    toDate: _lastYear.endDate
                },
                submenu: []
            },

            {
                text: 'Custom Dates',
                icon: 'glyphicon-calendar',
                route: '/home/customDates',
                submenu: [],
                params: {}
            }
        ],
    }
    ,
    {
        text: 'Work Scale',
        icon: 'glyphicon-dashboard',
        //route: null,
        route: '',
        submenu: [
            {
                text: 'Percentage',
                icon: '',
                route: '/home/resPlans',
                params: {
                    workunits: '3'
                },
                submenu: []
            }
            , {
                text: 'Days',
                icon: '',
                route: '/home/resPlans',
                params: {
                    workunits: '2'
                },
                submenu: []
            },
            {
                text: 'Hours',
                icon: '',
                route: '/home/resPlans',
                params: {
                    workunits: '1'
                },
                submenu: []
            }
            
        ]
    },
    {
        text: 'Time Scale',
        icon: 'glyphicon-dashboard',
        route: '',
        submenu: [
            {
                text: 'Months',
                icon: '',
                route: '/home/resPlans',
                params: {
                    timescale: '5'
                },
                submenu: []
            }
            , {
                text: 'Years',
                icon: '',
                route: '/home/resPlans',
                params: {
                    timescale: '7'
                },
                submenu: []
            },
            {
                text: 'Weeks',
                icon: '',
                route: '/home/resPlans',
                params: {
                    timescale: '4'
                },
                submenu: []
            }
            
        ]
    }
    
    
];