import { ProjectModel } from './common/projects.model';
import { signal, Component, WritableSignal, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'aj-projects',
    styleUrl: './projects.css',
    templateUrl: './projects.html',
    encapsulation: ViewEncapsulation.None
})
export class Projects {
    protected readonly projectsList: WritableSignal<ProjectModel[]> = signal([]);

    constructor () {
        this.loadProjectsList();
    }

    private loadProjectsList(): void {
        this.projectsList.set(
            [
                {
                    title: 'Client Management BE',
                    description: "Client Management BE is a backend service which will be used for managing client's and OAuth related requests and token validations."
                },
                {
                    title: 'Auth Server',
                    description: 'This service will be used for Authentication & Authorization, User Management and Token Management.'
                },
                {
                    title: 'Portfolio CMD BE',
                    description: "Portfolio CMD BE is a backend service for adding, modifying and deleting User related data for the Portfolio UI as well as Portfolio Admin UI."
                },
                {
                    title: 'Portfolio Query BE',
                    description: "Portfolio Query BE is a backend service for getting User related data for the Portfolio UI as well as Portfolio Admin UI."
                },
                {
                    title: 'Portfolio Admin UI',
                    description: "Portfolio Admin UI is an UI application which will be used to add new clients, users and user related data like Education, Work Experience."
                },
                {
                    title: 'Portfolio',
                    description: "Portfolio UI is an UI application which will be used to display the actual profile of the users."
                }
            ]
        );
    }
}
