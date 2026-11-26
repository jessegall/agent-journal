<?php

declare(strict_types=1);

namespace Tests\Unit\Drivers;

use App\Agents\Drivers\ClaudeCode\ClaudeCodeAdapter;
use App\Agents\Drivers\Codex\CodexAdapter;
use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Hooks\HookReplies;
use App\Agents\Values\PlanFile;
use App\Sessions\Enums\OfflineReplyMode;
use Tests\TestCase;

/**
 * Each driver's start carries a reply file its hook answers from while the journal is away: it names the driver's
 * events and own child tools, refuses a tool call in the driver's own shape, and its seal holds only for the bytes the
 * journal wrote under the start's key.
 */
final class HookRepliesTest extends TestCase
{
    public function test_each_driver_gets_a_reply_file_sealed_under_its_own_key(): void
    {
        $results = [];

        $adapters = [
            DefaultDrivers::CLAUDE_CODE => ClaudeCodeAdapter::class,
            DefaultDrivers::CODEX => CodexAdapter::class,
        ];

        foreach ($adapters as $family => $adapter) {
            [$replyFile, $keyFile] = $this->app->make(HookReplies::class)->filesFor($adapter, OfflineReplyMode::Refuse);
            $sealed = json_decode($replyFile->content, true, flags: JSON_THROW_ON_ERROR);
            $body = json_decode($sealed['body'], true, flags: JSON_THROW_ON_ERROR);
            $changed = substr_replace($sealed['body'], 'X', 10, 1);

            $results[$family] = [
                $this->names($replyFile, $keyFile),
                $body['spawnTools'] === $adapter::nativeChildTools(),
                $body['events'] === $adapter::nativeEvents(),
                $body['toolEvents'],
                json_decode($body['replies']['spawn']['PreToolUse']['stdout'], true)['hookSpecificOutput']['permissionDecision'],
                [$body['budgetMs'], $body['retries'], $body['unknownEvent']['exitCode']],
                hash_equals($sealed['seal'], HookReplies::sealOf($sealed['body'], $keyFile->content)),
                hash_equals($sealed['seal'], HookReplies::sealOf($changed, $keyFile->content)),
            ];
        }

        $expected = [[HookReplies::REPLY_FILE, HookReplies::KEY_FILE], true, true, ['PreToolUse', 'PostToolUse'], 'deny', [5000, 1, 2], true, false];
        $this->journal->assertResult([DefaultDrivers::CLAUDE_CODE => $expected, DefaultDrivers::CODEX => $expected], $results);
    }

    public function test_two_starts_never_share_a_key(): void
    {
        $replies = $this->app->make(HookReplies::class);

        $this->assertNotSame(
            $replies->filesFor(ClaudeCodeAdapter::class, OfflineReplyMode::Refuse)[1]->content,
            $replies->filesFor(ClaudeCodeAdapter::class, OfflineReplyMode::Refuse)[1]->content,
        );
    }

    public function test_a_start_granted_the_neutral_reply_is_answered_neutrally_while_the_journal_is_away(): void
    {
        $replies = $this->app->make(HookReplies::class);
        $awayOf = fn (OfflineReplyMode $mode) => json_decode(json_decode(
            $replies->filesFor(ClaudeCodeAdapter::class, $mode)[0]->content,
            true,
            flags: JSON_THROW_ON_ERROR,
        )['body'], true, flags: JSON_THROW_ON_ERROR)['replies']['away']['PreToolUse'];

        $denies = fn (OfflineReplyMode $mode) => str_contains($awayOf($mode)['stdout'].$awayOf($mode)['stderr'], 'deny');

        $this->journal->assertResult([false, true], [$denies(OfflineReplyMode::Neutral), $denies(OfflineReplyMode::Refuse)]);
    }

    /**
     * @return list<string>
     */
    private function names(PlanFile ...$files): array
    {
        return array_map(fn (PlanFile $file) => $file->name, $files);
    }
}
