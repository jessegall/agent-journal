<?php

declare(strict_types=1);

namespace Domain\Helpers;

use App\Concerns\HasAssignables;
use App\Concerns\HasStates;
use App\Contracts\Assignments\InternalAssignableContributor;
use App\Contracts\Authorization\PolicyProvider;
use App\Contracts\Bus\CommandProvider;
use App\Contracts\Navigation\PageProvider;
use App\Contracts\Records\StateProvider;
use App\Declarations\Page;
use App\Enums\Agents\AccessType;
use App\Enums\Navigation\Icon;
use App\Mcp\Contracts\McpToolProvider;
use App\Support\Command;
use App\Support\Domain;
use App\Support\Exports;
use App\Support\FolderClasses;
use App\Values\PolicyDefinition;
use Domain\Documents\DocumentsDomain;
use Domain\Helpers\Commands\CancelHelperJob\CancelHelperJobCommand;
use Domain\Helpers\Commands\ContinueHelper\ContinueHelperCommand;
use Domain\Helpers\Commands\SendHelper\SendHelperCommand;
use Domain\Helpers\Commands\StartHelper\StartHelperCommand;
use Domain\Helpers\Commands\SteerHelper\SteerHelperCommand;
use Domain\Helpers\Enums\JobState;
use Domain\Helpers\Exceptions\HelperBusy;
use Domain\Helpers\Exceptions\HelperJobAlreadyEnded;
use Domain\Helpers\Exceptions\HelperJobUnfinished;
use Domain\Helpers\Exceptions\HelperLaunchUncertain;
use Domain\Helpers\Exceptions\HelperProfileMismatch;
use Domain\Helpers\Exceptions\HelperProfilesUnavailable;
use Domain\Helpers\Exceptions\HelperProfileTypeConflict;
use Domain\Helpers\Exceptions\HelperRequestConflict;
use Domain\Helpers\Exceptions\HelperRetired;
use Domain\Helpers\Exceptions\HelperUnavailable;
use Domain\Helpers\Http\Pages\Resolvers\HelperJobsLayoutResolver;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Policies\HelperPolicy;
use Domain\Helpers\Resolvers\HelperJobAssignments;
use Domain\Helpers\Support\States\HelperJobState;
use Domain\Helpers\Values\HelperReceipt;
use Domain\Helpers\Values\HelperWork;
use Domain\Helpers\Values\LaunchDetails;
use Domain\Helpers\Values\SteerReceipt;

final class HelpersDomain extends Domain implements
    CommandProvider,
    InternalAssignableContributor,
    McpToolProvider,
    PageProvider,
    PolicyProvider,
    StateProvider
{
    use HasAssignables;
    use HasStates;

    /**
     * @return list<Page>
     */
    public function pages(): array
    {
        return [
            Page::layout(
                'jobs',
                'Helper jobs',
                Icon::Activity,
                HelperJobsLayoutResolver::class,
            )->at('jobs')->onHome(28),
        ];
    }

    public function description(): string
    {
        return 'Helper identities, their jobs and purposes, and how a parent dispatches them.';
    }

    /**
     * @return list<class-string>
     */
    public function commands(): array
    {
        return FolderClasses::in(__DIR__.'/Commands/*', Command::class);
    }

    /**
     * @return list<class-string<Domain>>
     */
    public function requires(): array
    {
        return [DocumentsDomain::class];
    }

    public function exports(): Exports
    {
        return Exports::make()
            ->values(
                HelperReceipt::class,
                HelperWork::class,
                JobState::class,
                LaunchDetails::class,
                SteerReceipt::class,
            )
            ->commands(
                StartHelperCommand::class,
                SendHelperCommand::class,
                ContinueHelperCommand::class,
                SteerHelperCommand::class,
                CancelHelperJobCommand::class,
            )
            ->exceptions(
                HelperUnavailable::class,
                HelperBusy::class,
                HelperJobUnfinished::class,
                HelperLaunchUncertain::class,
                HelperRetired::class,
                HelperProfileMismatch::class,
                HelperProfileTypeConflict::class,
                HelperProfilesUnavailable::class,
                HelperRequestConflict::class,
                HelperJobAlreadyEnded::class,
            )
            ->build();
    }

    public function policies(): array
    {
        return [
            new PolicyDefinition(
                HelperPolicy::class,
                [
                    AccessType::Create,
                    AccessType::Edit,
                    AccessType::Delegate,
                ],
            ),
        ];
    }

    public function internalAssignables(): array
    {
        return [HelperJob::linkType() => HelperJobAssignments::class];
    }

    public function states(): array
    {
        return [HelperJobState::class];
    }

    public function mcpResources(): array
    {
        return [];
    }

    public function overviewContributions(): array
    {
        return [];
    }
}
