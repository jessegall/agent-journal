<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks\States;

use App\Commands\Asks\OfferNextAsk\OfferNextAskCommand;
use App\Events\Asks\AskClosed;
use App\Support\Decisions\Decision;
use App\Support\States\AnsweringAskState;
use PHPUnit\Framework\TestCase;

/**
 * The ask answering state settles itself when its ask closes and asks for the holder's next ask; another ask's close
 * changes nothing.
 */
final class AnsweringAskStateTest extends TestCase
{
    private const string ASK = 'ask-1';

    private const string HOP = 'hop-1';

    public function test_its_ask_closing_finishes_it_and_offers_the_next_ask(): void
    {
        $state = new AnsweringAskState(self::ASK, self::HOP);

        $this->assertEquals(Decision::delegate(), $state->onAskClosed(new AskClosed('ask-2', 'question')));
        $this->assertFalse($state->isFinished());

        $answer = $state->onAskClosed(new AskClosed(self::ASK, 'question'));

        $this->assertEquals(new OfferNextAskCommand(self::HOP), $answer);
        $this->assertTrue($state->isFinished());
    }
}
