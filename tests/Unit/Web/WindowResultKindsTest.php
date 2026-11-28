<?php

declare(strict_types=1);

namespace Tests\Unit\Web;

use App\Actors\ActorStore;
use App\Data\Pages\FailedWindow;
use App\Exceptions\LayoutRefused;
use App\Exceptions\PrivateRecordMissing;
use App\Navigation\Declarations\DomainClient;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutPartData;
use App\Support\WindowResultBuilder;
use App\Terminals\Enums\LayoutTag;
use App\Web\Creation\SurfaceDefinition;
use Closure;
use Psr\Log\LoggerInterface;
use RuntimeException;
use Spatie\LaravelData\Data;
use Tests\Fixtures\ClientDeclarations\Shelf\Http\Pages\ShelfLayoutPageBuilder;
use Tests\Fixtures\ClientDeclarations\Shelf\Http\Pages\ShelfLayoutPageData;
use Tests\TestCase;

/**
 * A reader's private record answers the same whether it is missing or denied, an authorized empty read is ready, and
 * a broken reader is logged and answers the neutral failure.
 */
final class WindowResultKindsTest extends TestCase
{
    public function test_a_missing_and_a_denied_private_record_answer_byte_for_byte_alike(): void
    {
        $missing = $this->resultOf(fn () => throw PrivateRecordMissing::forReader());
        $denied = $this->resultOf(fn () => throw PrivateRecordMissing::forReader());

        $this->assertSame(['status' => 'denied'], $missing->toArray());
        $this->assertSame(json_encode($missing->toArray()), json_encode($denied->toArray()));
    }

    public function test_an_authorized_empty_read_is_ready(): void
    {
        $result = $this->resultOf(fn () => DeclaredLayoutData::build()
            ->root(LayoutPartData::build()->asCollection()->key('loans')->style('list')->rows([])->finish())
            ->finish());

        $this->assertSame('ready', $result->toArray()['status']);
    }

    public function test_a_broken_reader_is_logged_and_answers_the_neutral_failure(): void
    {
        $log = $this->createMock(LoggerInterface::class);
        $log->expects($this->once())->method('error');
        $this->app->instance(LoggerInterface::class, $log);

        $result = $this->resultOf(fn () => throw new RuntimeException('the table is gone'));

        $this->assertSame(
            [
                'status' => 'failed',
                'message' => FailedWindow::MESSAGE,
                'reason' => 'RuntimeException: the table is gone',
            ],
            $result->toArray(),
        );
    }

    public function test_a_failing_window_logs_its_class_message_key_and_reader(): void
    {
        $log = $this->createMock(LoggerInterface::class);
        $log->expects($this->once())->method('error')->with(
            'The window shelf.lent failed: RuntimeException: the table is gone',
            $this->callback(
                fn (array $context): bool => $context['key'] === 'shelf.lent'
                    && $context['reader'] === ShelfLayoutPageBuilder::class
                    && $context['exception'] instanceof RuntimeException,
            ),
        );
        $this->app->instance(LoggerInterface::class, $log);

        $this->resultOf(fn () => throw new RuntimeException('the table is gone'));
    }

    public function test_a_part_with_an_unknown_style_names_the_styles_allowed(): void
    {
        $result = $this->resultOf(
            fn () => DeclaredLayoutData::build()
                ->root(LayoutPartData::build()->asText()->key('when')->value('Now')->style('clock')->finish())
                ->finish(),
        );

        $this->assertSame('failed', $result->toArray()['status']);
        $this->assertStringContainsString('LayoutRefused', $result->toArray()['reason']);
        $this->assertStringContainsString(
            LayoutRefused::unknownStyle('root', LayoutTag::Text, 'clock')->getMessage(),
            $result->toArray()['reason'],
        );
    }

    public function test_the_failed_window_names_no_reason_outside_local_and_testing(): void
    {
        $this->app['env'] = 'production';

        $result = $this->resultOf(fn () => throw new RuntimeException('the table is gone'));

        $this->assertSame(
            ['status' => 'failed', 'message' => FailedWindow::MESSAGE, 'reason' => null],
            $result->toArray(),
        );
    }

    /**
     * @param  Closure(): Data  $read
     */
    private function resultOf(Closure $read): Data
    {
        return $this->app->make(ActorStore::class)->actAsSystem(
            'test',
            fn (): Data => $this->app->make(WindowResultBuilder::class)->surface(
                'shelf.lent',
                'window shelf.lent',
                [],
                $this->definition(),
                fn () => ShelfLayoutPageData::build()->shown($read())->finish(),
            ),
        );
    }

    private function definition(): SurfaceDefinition
    {
        return new SurfaceDefinition(
            ShelfLayoutPageData::class,
            ShelfLayoutPageBuilder::class,
            DomainClient::DECLARED_LAYOUT,
        );
    }
}
