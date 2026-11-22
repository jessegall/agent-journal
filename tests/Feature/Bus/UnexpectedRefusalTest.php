<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\Contracts\RefusalMapper;
use RuntimeException;
use Tests\TestCase;

/**
 * A failure nothing names is shown with its correlation id; where a developer reads (local and testing) its details
 * also name the failure's class and message, and elsewhere they stay empty.
 */
final class UnexpectedRefusalTest extends TestCase
{
    public function test_an_unexpected_failure_names_its_class_and_message_in_testing(): void
    {
        $refusal = $this->app->make(RefusalMapper::class)
            ->refusal(new RuntimeException('the table is gone'), 'tasks.list', 'abc123');

        $this->assertSame(
            ['exception' => RuntimeException::class, 'cause' => 'the table is gone'],
            $refusal->details,
        );
        $this->assertStringContainsString('abc123', $refusal->message);
    }

    public function test_an_unexpected_failure_names_only_its_correlation_id_in_production(): void
    {
        $this->app['env'] = 'production';

        $refusal = $this->app->make(RefusalMapper::class)
            ->refusal(new RuntimeException('the table is gone'), 'tasks.list', 'abc123');

        $this->assertSame([], $refusal->details);
    }
}
