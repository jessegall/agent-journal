<?php

declare(strict_types=1);

namespace Tests\Unit\Support;

use Tests\TestCase;

/**
 * A test's application takes its configuration from what the process read once, not from the files again, and a
 * test's own change to it stays within that test.
 */
final class CachedConfigTest extends TestCase
{
    private const string CHANGED_NAME = 'Changed in a test';

    public function test_the_configuration_comes_from_the_process_cache(): void
    {
        $this->assertTrue($this->app->bound('config_loaded_from_cache'));
        $this->assertSame('testing', config('app.env'));
    }

    public function test_a_change_in_one_test_does_not_reach_the_next(): void
    {
        config(['app.name' => self::CHANGED_NAME]);

        $this->assertSame(self::CHANGED_NAME, config('app.name'));
    }

    public function test_the_next_test_sees_the_configuration_as_read(): void
    {
        $this->assertNotSame(self::CHANGED_NAME, config('app.name'));
    }
}
