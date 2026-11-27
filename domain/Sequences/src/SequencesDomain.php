<?php

declare(strict_types=1);

namespace Domain\Sequences;

use App\Access\Contracts\PolicyProvider;
use App\Access\Values\PolicyDefinition;
use App\Agents\Drivers\Contracts\NativePartProvider;
use App\Agents\Enums\AccessType;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandProvider;
use App\Concerns\HasStates;
use App\Declarations\Page;
use App\Declarations\PageActions;
use App\Navigation\Contracts\DraftProducerProvider;
use App\Navigation\Contracts\NavigationProvider;
use App\Navigation\Contracts\PageProvider;
use App\Navigation\Declarations\NavigationItem;
use App\Navigation\Enums\Icon;
use App\Records\Contracts\StateProvider;
use App\Skills\Contracts\SkillProvider;
use App\Support\Domain;
use App\Support\Exports;
use App\Support\FolderClasses;
use Domain\Sequences\Events\SequenceStarted;
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
use Domain\Sequences\Support\States\FollowSequenceState;

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
                ->actions(fn (PageActions $actions) => $actions
                    ->post('create', DefineSequenceController::class, 'define-sequence')),
            Page::layout('new', 'New sequence', Icon::Sequence, NewSequenceResolver::class)->at('new'),
            Page::layout('runs', 'Runs', Icon::Activity, SequenceRunsResolver::class)->at('runs'),
            Page::layout('edit', 'Edit steps', Icon::Sequence, SequenceEditorResolver::class)->at('{sequence}/edit'),
            Page::layout('sequence', 'Sequence', Icon::Sequence, SequenceWindowResolver::class)
                ->at('{sequence}')
                ->actions(fn (PageActions $actions) => $actions
                    ->patch('{sequence}', ChangeSequenceController::class, 'change-sequence')),
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
        return [FollowSequenceState::class];
    }

    public function skills(): array
    {
        return [SequencesSkill::class];
    }
}
