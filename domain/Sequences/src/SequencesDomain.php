<?php

declare(strict_types=1);

namespace Domain\Sequences;

use App\Actors\Contracts\PolicyProvider;
use App\Actors\Values\PolicyRegistration;
use App\Bus\Contracts\CommandProvider;
use App\Domains\Concerns\HasNumberedModels;
use App\Domains\Concerns\HasStates;
use App\Domains\Contracts\StateProvider;
use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use App\Numbers\Contracts\NumberedModelProvider;
use App\Numbers\Support\NumberedModel;
use App\Operations\Enums\AccessType;
use App\Skills\Contracts\SkillProvider;
use Domain\Sequences\Commands\StartSequence;
use Domain\Sequences\Models\SequenceRun;
use Domain\Sequences\Policies\SequencePolicy;
use Domain\Sequences\Skills\SequencesSkill;
use Domain\Sequences\States\Support\FollowingSequenceStateFactory;
use Domain\Sequences\States\Support\FollowingSequenceStateReference;

final class SequencesDomain extends Domain implements
    CommandProvider,
    NumberedModelProvider,
    PolicyProvider,
    SkillProvider,
    StateProvider
{
    use HasNumberedModels, HasStates;

    public function description(): string
    {
        return 'Steps an agent follows one at a time.';
    }

    public function policies(): array
    {
        return [
            new PolicyRegistration(
                SequencePolicy::class,
                [AccessType::Create],
            ),
        ];
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
