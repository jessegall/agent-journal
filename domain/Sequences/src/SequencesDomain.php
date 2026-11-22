<?php

declare(strict_types=1);

namespace Domain\Sequences;

use App\Actors\Contracts\PolicyProvider;
use App\Actors\Values\PolicyDefinition;
use App\Bus\Contracts\CommandProvider;
use App\Domains\Concerns\HasStates;
use App\Domains\Contracts\StateProvider;
use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use App\Operations\Enums\AccessType;
use App\Skills\Contracts\SkillProvider;
use App\Ui\Contracts\NativePartProvider;
use Domain\Sequences\Commands\StartSequence;
use Domain\Sequences\Policies\SequencePolicy;
use Domain\Sequences\Skills\SequencesSkill;
use Domain\Sequences\States\Support\FollowingSequenceStateFactory;
use Domain\Sequences\States\Support\FollowingSequenceStateReference;

final class SequencesDomain extends Domain implements
    CommandProvider,
    NativePartProvider,
    PolicyProvider,
    SkillProvider,
    StateProvider
{
    use HasStates;

    public function description(): string
    {
        return 'Steps an agent follows one at a time.';
    }

    public function policies(): array
    {
        return [
            new PolicyDefinition(
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

    /**
     * The native part a declared page mounts to edit the steps of a sequence definition.
     *
     * @return list<string>
     */
    public function nativeParts(): array
    {
        return ['SequenceEditor.vue'];
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

    public function skills(): array
    {
        return [SequencesSkill::class];
    }
}
