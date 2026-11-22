<?php

declare(strict_types=1);

namespace Domain\Helpers;

use App\Actors\Contracts\PolicyProvider;
use App\Actors\Values\PolicyDefinition;
use App\Autoload\Support\FolderClasses;
use App\Bus\Contracts\CommandProvider;
use App\Bus\Support\Command;
use App\Domains\Concerns\HasAssignables;
use App\Domains\Contracts\InternalAssignableContributor;
use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use App\Mcp\Contracts\McpToolProvider;
use App\Operations\Enums\AccessType;
use App\Ui\Contracts\PageProvider;
use App\Ui\Declarations\Page;
use App\Ui\Enums\Icon;
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
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Policies\HelperPolicy;
use Domain\Helpers\Resolvers\HelperJobAssignments;
use Domain\Helpers\Resolvers\HelperJobsLayoutResolver;
use Domain\Helpers\Values\HelperReceipt;
use Domain\Helpers\Values\HelperWork;
use Domain\Helpers\Values\JobLaunch;
use Domain\Helpers\Values\SteerReceipt;

final class HelpersDomain extends Domain implements
    CommandProvider,
    InternalAssignableContributor,
    McpToolProvider,
    PageProvider,
    PolicyProvider
{
    use HasAssignables;

    /**
     * @return list<Page>
     */
    public function pages(): array
    {
        return [Page::layout('jobs', 'Helper jobs', Icon::Activity, HelperJobsLayoutResolver::class)->at('jobs')];
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
                JobLaunch::class,
                JobState::class,
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
                [AccessType::Create, AccessType::Edit, AccessType::Delegate],
            ),
        ];
    }

    public function internalAssignables(): array
    {
        return [HelperJob::LINK_TYPE => HelperJobAssignments::class];
    }

    public function mcpResources(): array
    {
        return [];
    }

    public function overviewContributions(): array
    {
        return [];
    }

    public function searchContributions(): array
    {
        return [];
    }
}
