<?php

declare(strict_types=1);

namespace Domain\Sequences;

use Domain\Sequences\Events\SequenceStarted;
use App\Concerns\HasStates;
use App\Contracts\Authorization\PolicyProvider;
use App\Contracts\Bus\Command;
use App\Contracts\Bus\CommandProvider;
use App\Contracts\Drivers\NativePartProvider;
use App\Contracts\Navigation\DraftProducerProvider;
use App\Contracts\Navigation\NavigationProvider;
use App\Contracts\Navigation\PageProvider;
use App\Contracts\Records\StateProvider;
use App\Contracts\Skills\SkillProvider;
use App\Declarations\ActionRoute;
use App\Declarations\NavigationItem;
use App\Declarations\Page;
use App\Enums\AccessType;
use App\Enums\Icon;
use App\Support\Domain;
use App\Support\Exports;
use App\Support\FolderClasses;
use App\Values\PolicyDefinition;
use Domain\Sequences\Http\Controllers\ChangeSequenceController;
use Domain\Sequences\Http\Controllers\DefineSequenceController;
use Domain\Sequences\Http\Pages\Resolvers\NewSequenceResolver;
use Domain\Sequences\Http\Pages\Resolvers\SequenceEditorResolver;
use Domain\Sequences\Http\Pages\Resolvers\SequenceIndexResolver;
use Domain\Sequences\Http\Pages\Resolvers\SequenceRunsResolver;
use Domain\Sequences\Http\Pages\Resolvers\SequenceRunWindowResolver;
use Domain\Sequences\Http\Pages\Resolvers\SequenceWindowResolver;
use Domain\Sequences\Policies\SequencePolicy;
use Domain\Sequences\Policies\StoredSequencePolicy;
use Domain\Sequences\Support\SequenceDraftProducer;
use Domain\Sequences\Support\Skills\SequencesSkill;
use Domain\Sequences\Support\States\FollowingSequenceState;

final class SequencesDomain extends Domain implements
    CommandProvider,
    DraftProducerProvider,
    NativePartProvider,
    NavigationProvider,
    PageProvider,
    PolicyProvider,
    SkillProvider,
    StateProvider
{
    use HasStates;

    public function description(): string
    {
        return 'Steps an agent follows one at a time.';
    }

    public function draftProducers(): array
    {
        return ['sequence' => SequenceDraftProducer::class];
    }

    public function policies(): array
    {
        return [
            new PolicyDefinition(
                SequencePolicy::class,
                [AccessType::Create, AccessType::Edit],
            ),
            new PolicyDefinition(
                StoredSequencePolicy::class,
                [AccessType::Read, AccessType::Create, AccessType::Edit],
            ),
        ];
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

    public function navigation(): array
    {
        return [NavigationItem::page('index', 'Sequences', Icon::Sequence, position: 40)];
    }

    /**
     * The run page, reached by a run's own link, and the Sequences page the sidebar opens.
     */
    public function pages(): array
    {
        return [
            Page::layout('index', 'Sequences', Icon::Sequence, SequenceIndexResolver::class)
                ->at('')
                ->actions(ActionRoute::post('create', DefineSequenceController::class, 'define-sequence')),
            Page::layout('new', 'New sequence', Icon::Sequence, NewSequenceResolver::class)->at('new'),
            Page::layout('runs', 'Runs', Icon::Activity, SequenceRunsResolver::class)->at('runs'),
            Page::layout('edit', 'Edit steps', Icon::Sequence, SequenceEditorResolver::class)->at('{sequence}/edit'),
            Page::layout('sequence', 'Sequence', Icon::Sequence, SequenceWindowResolver::class)
                ->at('{sequence}')
                ->actions(ActionRoute::patch('{sequence}', ChangeSequenceController::class, 'change-sequence')),
            Page::layout('run', 'Sequence run', Icon::Activity, SequenceRunWindowResolver::class)->at('runs/{run}'),
        ];
    }

    public function exports(): Exports
    {
        return Exports::make()
            ->events(SequenceStarted::class)
            ->build();
    }

    public function states(): array
    {
        return [FollowingSequenceState::class];
    }

    public function skills(): array
    {
        return [SequencesSkill::class];
    }
}
