<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

use App\Support\Reflector;
use Closure;
use PHPUnit\Framework\Assert;
use Throwable;

/**
 * What the journal fixture asserts of a command it ran: the result it gave, or the refusal it was given.
 */
trait AssertsResults
{
    /**
     * The result is the expected one: the same scalar, or an object whose properties are the same.
     */
    public function assertResult(mixed $expected, mixed $actual): self
    {
        if (is_object($expected)) {
            Assert::assertEquals($expected, $actual);

            return $this;
        }

        Assert::assertSame($expected, $actual);

        return $this;
    }

    /**
     * Runs the act once and asserts it was refused with the type given; the refusal goes to the verifier, any other
     * failure passes on as it was, and an act that ends without a refusal fails the test.
     *
     * @template TRefusal of Throwable
     *
     * @param  class-string<TRefusal>  $type
     * @param  (Closure(TRefusal): void)|null  $verify
     */
    public function assertRefused(string $type, Closure $act, Closure|null $verify = null): self
    {
        $refusal = $this->refusalOf($type, $act);

        Assert::assertNotNull($refusal, "The act ended without the refusal {$type}.");

        if ($verify !== null) {
            $verify($refusal);
        }

        return $this;
    }

    /**
     * @template TRefusal of Throwable
     *
     * @param  class-string<TRefusal>  $type
     * @return TRefusal|null
     */
    private function refusalOf(string $type, Closure $act): Throwable|null
    {
        try {
            $act();
        } catch (Throwable $failure) {
            if (! Reflector::of($type)->isInstance($failure)) {
                throw $failure;
            }

            return $failure;
        }

        return null;
    }
}
