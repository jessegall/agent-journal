<?php

declare(strict_types=1);

namespace App\Pipelines\Support;

use App\Pipelines\Contracts\Pipable;
use Closure;

/**
 * Steps run round after round while a condition holds for the value.
 */
final readonly class RepeatedStep extends Step
{
    /**
     * @param  list<class-string<Pipable>|Step>  $steps
     */
    public function __construct(private array $steps, private Closure $while) {}

    public function run(Closure $sequence): Closure
    {
        $round = $sequence($this->steps);
        $while = $this->while;

        return function (object $value) use ($round, $while): object {
            while ($while($value)) {
                $value = $round($value);
            }

            return $value;
        };
    }
}
