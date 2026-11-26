<?php

declare(strict_types=1);

namespace Tests\Machinery\Seeding;

use App\Bus\Exceptions\RaisedOutsideUnit;
use App\Models\Projects\Project;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A test seeds rows outside a command, while every way into the app refuses such a write as the running app does:
 * a request and an artisan command.
 */
final class JournalOutsideWritesTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_the_test_itself_seeds_a_row_outside_a_command(): void
    {
        $this->journal->project('Alpha');

        $this->assertSame(['Alpha'], Project::query()->where('name', 'Alpha')->pluck('name')->all());
    }

    public function test_an_artisan_command_refuses_a_write_outside_a_command(): void
    {
        $journal = $this->journal;
        Artisan::command('test:seed-outside', fn () => $journal->project('Beta'));

        $this->expectExceptionObject(RaisedOutsideUnit::for(Project::class));

        $this->artisan('test:seed-outside')->run();
    }

    public function test_a_request_refuses_a_write_outside_a_command(): void
    {
        $journal = $this->journal;
        Route::get('test-seed-outside', fn () => $journal->project('Gamma')->projectCalled('Gamma')->id);
        $this->withoutExceptionHandling();

        $this->expectExceptionObject(RaisedOutsideUnit::for(Project::class));

        $this->get('test-seed-outside');
    }

    public function test_the_test_seeds_again_once_the_refused_entry_ended(): void
    {
        $journal = $this->journal;
        Artisan::command('test:seed-outside', fn () => $journal->project('Delta'));

        $this->assertThrows(fn () => $this->artisan('test:seed-outside')->run(), RaisedOutsideUnit::class);
        $this->journal->project('Epsilon');

        $this->assertSame(['Epsilon'], Project::query()->where('name', 'Epsilon')->pluck('name')->all());
    }
}
