<?php

declare(strict_types=1);

namespace Domain\Helpers;

use App\Actors\Contracts\ProvidesPolicies;
use App\Actors\Values\PolicyRegistration;
use App\Autoload\Support\FolderClasses;
use App\Bus\Contracts\ProvidesCommands;
use App\Bus\Support\Command;
use App\Domains\Concerns\HasAssignables;
use App\Domains\Contracts\ProvidesInternalAssignables;
use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use Domain\Helpers\Commands\SendHelper;
use Domain\Helpers\Commands\StartHelper;
use Domain\Helpers\Contracts\HelperReader;
use Domain\Helpers\Enums\HelperAbility;
use Domain\Helpers\Enums\JobState;
use Domain\Helpers\Exceptions\HelperBusy;
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
use Domain\Helpers\Support\HelperReceipt;
use Domain\Helpers\Support\HelperWork;
use Domain\Helpers\Support\JobLaunch;

final class HelpersDomain extends Domain implements ProvidesCommands, ProvidesInternalAssignables, ProvidesPolicies
{
    use HasAssignables;

    public function description(): string
    {
        return 'Helper identities, their jobs and purposes, and how a parent dispatches them.';
    }

    /**
     * @return list<class-string>
     */
    public function commands(): array
    {
        return FolderClasses::in(__DIR__.'/Commands', Command::class);
    }

    /**
     * @return list<class-string<Domain>>
     */
    public function requires(): array
    {
        return [];
    }

    public function exports(): Exports
    {
        return Exports::make()
            ->contracts(HelperReader::class)
            ->values(HelperReceipt::class, HelperWork::class, JobLaunch::class, JobState::class)
            ->commands(StartHelper::class, SendHelper::class)
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
            )
            ->build();
    }

    public function policies(): array
    {
        return [new PolicyRegistration(HelperJob::class, HelperPolicy::class, HelperAbility::class)];
    }

    public function internalAssignables(): array
    {
        return [HelperJob::LINK_TYPE => HelperJobAssignments::class];
    }
}
