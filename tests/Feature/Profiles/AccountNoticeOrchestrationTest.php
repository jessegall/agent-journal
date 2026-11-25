<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Enums\Accounts\AccountNoticeReason;
use App\Support\AccountNotices;
use Carbon\CarbonImmutable;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A driver's notices are recorded and resolved by Profiles under the driver's selection lock: a repeat counts the
 * open notice again, a resolve closes every open one of the driver and no other, and a record after it opens a new
 * one instead of bringing a resolved one back.
 */
final class AccountNoticeOrchestrationTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_resolve_closes_the_programs_open_notices_and_a_later_record_opens_a_new_one(): void
    {
        $notices = $this->app->make(AccountNotices::class);
        $resolved = $notices->record('codex', AccountNoticeReason::NeedsSignIn);
        $other = $notices->record('claude-code', AccountNoticeReason::NeedsSignIn);

        $notices->resolveOpen('codex', CarbonImmutable::now());
        $reopened = $notices->record('codex', AccountNoticeReason::NeedsSignIn);

        $this->assertNotNull($resolved->refresh()->resolved_at);
        $this->assertNull($other->refresh()->resolved_at);
        $this->assertNotSame($resolved->id, $reopened->id);
        $this->assertSame(1, $resolved->times);
    }
}
