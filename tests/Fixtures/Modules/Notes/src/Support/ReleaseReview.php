<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Support;

use App\Docking\Cards\Button;
use App\Docking\Cards\ChatExcerpt;
use App\Docking\Cards\ConsoleOutput;
use App\Docking\Cards\CountedProgress;
use App\Docking\Cards\Disclosure;
use App\Docking\Cards\DockCard;
use App\Docking\Cards\DockDestination;
use App\Docking\Cards\DockIdentity;
use App\Docking\Cards\Duration;
use App\Docking\Cards\ExcerptMessage;
use App\Docking\Cards\Group;
use App\Docking\Cards\IndeterminateProgress;
use App\Docking\Cards\Row;
use App\Docking\Cards\Stack;
use App\Docking\Cards\StateLabel;
use App\Docking\Cards\Subtitle;
use App\Docking\Cards\Title;
use App\Docking\Enums\Alignment;
use App\Docking\Enums\ConsoleStream;
use App\Docking\Enums\DisclosureState;
use App\Docking\Enums\Emphasis;
use App\Docking\Enums\Tone;
use App\Docking\Sources\Contracts\CardContext;
use App\Docking\Sources\Contracts\Dockable;
use App\Docking\Sources\DockDefinition;
use DateTimeImmutable;

/**
 * The release review: one card that uses every part of the card language, each tone, emphasis, alignment and
 * disclosure state, with the checks counted from the notes so a change refreshes it in place. Its oversized twin
 * holds more parts than a card may, and shows only its summary.
 */
final readonly class ReleaseReview implements Dockable
{
    public const string KEY = 'release-review';

    public const string OVERSIZED_KEY = 'release-review-oversized';

    public const int TOTAL_CHECKS = 8;

    public function __construct(private string $key, private int $passedChecks, private DateTimeImmutable $now) {}

    public function identifyFor(DockDefinition $definition): DockIdentity
    {
        return $definition->identity($this->key);
    }

    public function composeDockCard(CardContext $context): DockCard
    {
        if ($this->key === self::OVERSIZED_KEY) {
            $titles = array_map(fn (int $index) => new Title("line-{$index}", 'Line'), range(1, DockCard::NODE_LIMIT));

            return DockCard::named('Release review, oversized', Stack::of('root', ...$titles));
        }

        $checks = [
            new CountedProgress('passed', $this->passedChecks, self::TOTAL_CHECKS),
            new IndeterminateProgress('estimate', 'Waiting for estimate'),
            new Duration('build', $this->now->modify('-65 seconds'), $this->now),
            new Duration('deploy', $this->now->modify('-10 seconds')),
            new ChatExcerpt('excerpt', [new ExcerptMessage('Build bot', $this->now, 'Build ready')]),
            new ConsoleOutput('stderr', ConsoleStream::Stderr, ["\e[31merror\e[0m: <script>", 'second line'], true),
        ];

        foreach ($context->permittedDestination(new DockDestination('notes.index')) as $review) {
            $checks[] = new Button('open', 'Open review', Emphasis::Primary, $review);
        }

        return DockCard::named('Release review', Stack::of(
            'root',
            new Title('title', 'Release review'),
            new Subtitle('subtitle', 'Friday build'),
            new Disclosure('checks', 'Checks', DisclosureState::Closed, Stack::of('body', ...$checks)),
            new Row(
                'tones',
                Alignment::Between,
                ...array_map(fn (Tone $tone) => new StateLabel("tone-{$tone->value}", $tone->name, $tone), Tone::cases()),
            ),
            new Group('alignments', 'Alignments', ...array_map(
                fn (Alignment $alignment) => new Row("align-{$alignment->value}", $alignment, new Subtitle('label', $alignment->name)),
                Alignment::cases(),
            )),
            new Disclosure('notes', 'Notes', DisclosureState::Open, Stack::of('body', new Subtitle('note', 'Open by default'))),
        ));
    }
}
