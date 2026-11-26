<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks;

use App\Stacks\Exceptions\IncomingWorkFailed;
use App\Stacks\Exceptions\IncomingWorkRepeated;
use App\Stacks\IncomingWorkRegistration;
use Illuminate\Container\Container;
use Tests\Fixtures\Domains\Reviews\Work\ReviewInbox;
use Tests\Fixtures\Hooks\FailingIncomingWork;
use Tests\TestCase;

/**
 * Every hook accepts each registered piece of incoming work, built fresh; a piece registered twice is refused at
 * boot, and one that fails stops the hook with a named failure.
 */
final class IncomingWorkTest extends TestCase
{
    public function test_each_hook_accepts_the_registered_work_again(): void
    {
        ReviewInbox::$accepted = 0;
        $list = new IncomingWorkRegistration(new Container());
        $list->register(ReviewInbox::class);

        $list->acceptAll();
        $list->acceptAll();

        $this->assertSame(2, ReviewInbox::$accepted);
    }

    public function test_work_registered_twice_is_refused(): void
    {
        $list = new IncomingWorkRegistration(new Container());
        $list->register(ReviewInbox::class);

        $this->expectException(IncomingWorkRepeated::class);

        $list->register(ReviewInbox::class);
    }

    public function test_failing_work_stops_the_hook_with_a_named_failure(): void
    {
        $list = new IncomingWorkRegistration(new Container());
        $list->register(FailingIncomingWork::class);

        $this->expectException(IncomingWorkFailed::class);

        $list->acceptAll();
    }
}
