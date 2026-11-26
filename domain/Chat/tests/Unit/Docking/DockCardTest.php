<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Unit\Docking;

use App\Processes\Enums\DisclosureStatus;
use Domain\Chat\Contracts\Docking\DockPart;
use Domain\Chat\Enums\ConsoleStream;
use Domain\Chat\Exceptions\DockCardInvalid;
use Domain\Chat\Support\Cards\ConsoleOutput;
use Domain\Chat\Support\Cards\CountedProgress;
use Domain\Chat\Support\Cards\Disclosure;
use Domain\Chat\Support\Cards\DockCard;
use Domain\Chat\Support\Cards\Stack;
use Domain\Chat\Support\Cards\Subtitle;
use Domain\Chat\Support\Cards\Title;
use PHPUnit\Framework\TestCase;

/**
 * A dock card is built from typed parts: sibling keys are unique, progress stays in range, a disclosure shows
 * something, console text is plain, and a card past its budget is marked to show only its summary.
 */
final class DockCardTest extends TestCase
{
    public function test_a_card_of_a_title_and_a_subtitle_is_built_within_its_budget(): void
    {
        $card = DockCard::named('Release review', Stack::of('root', new Title('title', 'x'), new Subtitle('state', 'y')));

        $this->assertSame(['title', 'state'], array_map(fn (DockPart $part) => $part->key(), $card->root->children()));
        $this->assertFalse($card->isOverBudget);
    }

    public function test_two_siblings_with_one_key_are_refused(): void
    {
        $this->expectExceptionObject(DockCardInvalid::repeatedKey('title'));

        DockCard::named('Twice', Stack::of('root', new Title('title', 'x'), new Subtitle('title', 'y')));
    }

    public function test_progress_past_its_total_is_refused(): void
    {
        $this->expectExceptionObject(DockCardInvalid::progressOutOfRange('checks', 9, 8));

        new CountedProgress('checks', 9, 8);
    }

    public function test_a_disclosure_with_an_empty_body_is_refused(): void
    {
        $this->expectExceptionObject(DockCardInvalid::emptyDisclosure('checks'));

        new Disclosure('checks', 'Checks', DisclosureStatus::Closed, Stack::of('body'));
    }

    public function test_a_card_of_more_than_128_parts_is_over_its_budget(): void
    {
        $titles = array_map(fn (int $index) => new Title("title-{$index}", 'x'), range(1, DockCard::NODE_LIMIT));

        $this->assertTrue(DockCard::named('Many', Stack::of('root', ...$titles))->isOverBudget);
    }

    public function test_console_lines_lose_their_terminal_controls(): void
    {
        $output = new ConsoleOutput('stderr', ConsoleStream::Stderr, ["\e[31mfailed\e[0m\x07"], true);

        $this->assertSame(['failed'], $output->lines);
    }
}
