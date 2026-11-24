<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Support;

use App\Support\Cards\Button;
use App\Support\Cards\MessagesExcerpt;
use App\Support\Cards\ConsoleOutput;
use App\Support\Cards\CountedProgress;
use App\Support\Cards\Disclosure;
use App\Support\Cards\DockCard;
use App\Support\Cards\DockDestination;
use App\Support\Cards\DockIdentity;
use App\Support\Cards\Duration;
use App\Support\Cards\ExcerptMessage;
use App\Support\Cards\Group;
use App\Support\Cards\IndeterminateProgress;
use App\Support\Cards\Row;
use App\Support\Cards\Stack;
use App\Support\Cards\StateLabel;
use App\Support\Cards\Subtitle;
use App\Support\Cards\Title;
use App\Enums\Alignment;
use App\Enums\ConsoleStream;
use App\Enums\DisclosureState;
use App\Enums\Emphasis;
use App\Enums\Tone;
use App\Support\Sources\Contracts\CardContext;
use App\Support\Sources\Contracts\Dockable;
use App\Support\Sources\DockDefinition;
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
            new MessagesExcerpt('excerpt', [new ExcerptMessage('Build bot', $this->now, 'Build ready')]),
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
