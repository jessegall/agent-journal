<?php

declare(strict_types=1);

namespace Domain\Sequences;

use App\Actors\Contracts\ProvidesPolicies;
use App\Actors\Values\PolicyRegistration;
use App\Bus\Contracts\ProvidesCommands;
use App\Domains\Concerns\HasNumberedModels;
use App\Domains\Concerns\HasStates;
use App\Domains\Contracts\ProvidesStates;
use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use App\Numbers\Contracts\ProvidesNumberedModels;
use App\Numbers\Support\NumberedModel;
use App\Skills\Contracts\ProvidesSkills;
use Domain\Sequences\Commands\StartSequence;
use Domain\Sequences\Enums\SequenceAbility;
use Domain\Sequences\Models\SequenceRun;
use Domain\Sequences\Policies\SequencePolicy;
use Domain\Sequences\Skills\SequencesSkill;
use Domain\Sequences\States\Support\FollowingSequenceStateFactory;
use Domain\Sequences\States\Support\FollowingSequenceStateReference;

final class SequencesDomain extends Domain implements
    ProvidesCommands,
    ProvidesNumberedModels,
    ProvidesPolicies,
    ProvidesSkills,
    ProvidesStates
{
    use HasNumberedModels, HasStates;

    public function description(): string
    {
        return 'Steps an agent follows one at a time.';
    }

    public function policies(): array
    {
        return [new PolicyRegistration(SequenceRun::class, SequencePolicy::class, SequenceAbility::class)];
    }

    /**
     * @return list<class-string>
     */
    public function commands(): array
    {
        return [StartSequence::class];
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
            ->build();
    }

    public function states(): array
    {
        return [FollowingSequenceStateReference::TYPE_KEY => FollowingSequenceStateFactory::class];
    }

    public function numberedModels(): array
    {
        return [NumberedModel::global(SequenceRun::class)];
    }

    public function skills(): array
    {
        return [SequencesSkill::class];
    }
}
