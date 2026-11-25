<?php

declare(strict_types=1);

namespace Tests\Feature\Reads;

use Illuminate\Console\Events\CommandFinished;
use Illuminate\Console\Events\CommandStarting;
use Illuminate\Support\Facades\Log;
use Mockery;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\NullOutput;
use Tests\TestCase;

/**
 * Each request and artisan command is measured on its own and its counts are logged with its label.
 */
final class EntryMeasurementTest extends TestCase
{
    public function test_an_artisan_command_logs_its_own_counts(): void
    {
        Log::spy();

        $input = new ArrayInput([]);
        $output = new NullOutput();
        event(new CommandStarting('notes:list', $input, $output));
        event(new CommandFinished('notes:list', $input, $output, 0));

        Log::shouldHaveReceived('debug')->with(
            'reads',
            Mockery::on(fn (array $context): bool => $context['label'] === 'artisan notes:list'),
        )->once();
    }
}
