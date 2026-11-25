<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Events\Messages\MessageSent;
use Illuminate\Log\Events\MessageLogged;
use Illuminate\Support\Facades\Log;
use Tests\Support\MessagingTestCase;

/**
 * An operator reads in the log that a sent message's fact reached the broadcast with its audience, and how long the
 * queued page change waited before the queue broadcast it; the log never holds the message's text.
 */
final class PageChangeLogTest extends MessagingTestCase
{
    private const string SECRET_PLAN = 'A secret plan.';

    /**
     * @var list<array{string, array<string, mixed>}>
     */
    private array $lines = [];

    protected function setUp(): void
    {
        parent::setUp();

        Log::listen(function (MessageLogged $logged): void {
            $this->lines[] = [$logged->message, $logged->context];
        });
    }

    public function test_a_sent_message_logs_its_fact_and_audience_without_its_text(): void
    {
        $this->ownerSends($this->inboxIdOf($this->builder), 'A secret plan.');

        $this->assertContains(
            ['A page fact was committed.', ['fact' => MessageSent::class, 'users' => 1]],
            $this->lines,
        );
        $this->assertStringNotContainsString(self::SECRET_PLAN, json_encode($this->lines, JSON_THROW_ON_ERROR));
    }
}
