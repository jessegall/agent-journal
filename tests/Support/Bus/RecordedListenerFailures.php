<?php

declare(strict_types=1);

namespace Tests\Support\Bus;

use App\Bus\Contracts\CommittedListenerFailures;
use App\Bus\Exceptions\CommittedFactListenerFailed;
use Illuminate\Contracts\Container\Container;
use Illuminate\Contracts\Debug\ExceptionHandler;
use PHPUnit\Framework\Assert;

/**
 * A test's committed-listener failures: reported as production reports them, kept, and once the test ran each one
 * the test did not expect fails it, as does an expected one that never came.
 */
final class RecordedListenerFailures implements CommittedListenerFailures
{
    /**
     * @var list<CommittedFactListenerFailed>
     */
    private array $failures = [];

    /**
     * The listeners expected to fail, each as the failure names it: its class@method, or 'a listener' for a closure.
     *
     * @var list<string>
     */
    private array $expected = [];

    public function __construct(private readonly Container $container) {}

    public function take(CommittedFactListenerFailed $failure): void
    {
        // The handler of this moment, so a test that fakes the exceptions after its start sees the report.
        $this->container->make(ExceptionHandler::class)->report($failure);
        $this->failures[] = $failure;
    }

    public function expect(string $listener): void
    {
        $this->expected[] = $listener;
    }

    /**
     * Fails the test with every failure it did not expect, and with every expected listener that never failed.
     */
    public function assertAllExpected(): void
    {
        $unexpected = array_values(array_filter(
            $this->failures,
            fn (CommittedFactListenerFailed $failure) => ! $this->isExpected($failure),
        ));
        $missing = array_values(array_filter(
            $this->expected,
            fn (string $listener) => ! $this->hasFailureOf($listener),
        ));

        Assert::assertSame(
            [[], []],
            [array_map(fn (CommittedFactListenerFailed $failure) => $failure->getMessage(), $unexpected), $missing],
            'A listener failed on a committed fact the test did not expect, or an expected listener never failed.',
        );
    }

    private function isExpected(CommittedFactListenerFailed $failure): bool
    {
        foreach ($this->expected as $listener) {
            if (str_starts_with($failure->getMessage(), $listener)) {
                return true;
            }
        }

        return false;
    }

    private function hasFailureOf(string $listener): bool
    {
        foreach ($this->failures as $failure) {
            if (str_starts_with($failure->getMessage(), $listener)) {
                return true;
            }
        }

        return false;
    }
}
