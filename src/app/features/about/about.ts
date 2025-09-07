import { Component, signal, WritableSignal } from '@angular/core';
import { EducationModel } from './common/education.model';
import { WorkExperience } from './common/work-exp.model';

@Component({
    selector: 'aj-about',
    styleUrl: './about.css',
    templateUrl: './about.html',
    imports: []
})
export class About {
    protected readonly education: WritableSignal<EducationModel[]> = signal([]);
    protected readonly workExperience: WritableSignal<WorkExperience[]> = signal([]);

    constructor () {
        this.loadEducation();

        this.loadWorkExperience();
    }

    private loadEducation(): void {
        this.education.set(
            [
                {
                    endDate: 'June 2015',
                    startDate: 'August 2013',
                    location: 'Maharashtra, India',
                    degree: 'Master of Computer Applications (MCA)',
                    institution: 'Savitribai Phule Pune University',
                },
                {
                    endDate: 'June 2013',
                    startDate: 'June 2010',
                    location: 'Maharashtra, India',
                    institution: 'Mumbai University',
                    degree: 'Bachelor of Science – Information Technology (B.Sc. IT)',
                }
            ]
        );
    }

    private loadWorkExperience(): void {
        this.workExperience.set(
            [
                {
                    endDate: 'Present',
                    jobTitle: 'Tech Lead',
                    location: 'Thane, Maharashtra, India',
                    startDate: '06 October 2022',
                    companyName: 'Financial Software and Systems Pvt. Ltd. (FSS)',
                },
                {
                    endDate: '20 September 2022',
                    jobTitle: 'Technical Specialist',
                    location: 'Navi Mumbai, Maharashtra, India',
                    startDate: '26 March 2021',
                    companyName: 'BirlaSoft Ltd.',
                },
                {
                    endDate: '25 March 2021',
                    jobTitle: 'Android Developer',
                    location: 'Mumbai, Maharashtra, India',
                    startDate: '03 January 2018',
                    companyName: 'MindTech Solutions Pvt. Ltd.',
                },
                {
                    endDate: '30 June 2017',
                    jobTitle: 'Android Developer',
                    location: 'Mumbai, Maharashtra, India',
                    startDate: '10 April 2017',
                    companyName: 'Jobbie Services India Pvt. Ltd.',
                },
                {
                    endDate: '08 April 2017',
                    jobTitle: 'Software Developer',
                    location: 'Navi Mumbai, Maharashtra, India',
                    startDate: '03 August 2015',
                    companyName: 'ConnectMe Informatics Pvt. Ltd.',
                },
            ]
        );
    }
}
