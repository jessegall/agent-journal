<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Events\MessageSent;
use App\Events\PageChanged;
use App\Support\PageChangeBroadcastLog;
use Illuminate\Contracts\Queue\Job;
use Illuminate\Log\Events\MessageLogged;
use Illuminate\Queue\Events\JobProcessing;
use Illuminate\Support\Facades\Log;
use Mockery;
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

    public function test_a_queued_page_change_logs_how_long_it_waited(): void
    {
        $this->freezeSecond();

        $this->app->make(PageChangeBroadcastLog::class)->record(
            new JobProcessing('redis', $this->queuedJob(PageChanged::class, now()->getTimestamp() - 3)),
        );
        $this->app->make(PageChangeBroadcastLog::class)->record(
            new JobProcessing('redis', $this->queuedJob('App\\Jobs\\Other', now()->getTimestamp())),
        );

        $this->assertSame(
            [['A page change is being broadcast.', ['job' => 'job-1', 'queue' => 'default', 'waited_seconds' => 3]]],
            $this->lines,
        );
    }

    private function queuedJob(string $name, int $queuedAt): Job
    {
        $job = Mockery::mock(Job::class);
        $job->allows('resolveName')->andReturn($name);
        $job->allows('payload')->andReturn(['createdAt' => $queuedAt]);
        $job->allows('uuid')->andReturn('job-1');
        $job->allows('getQueue')->andReturn('default');

        return $job;
    }
}
