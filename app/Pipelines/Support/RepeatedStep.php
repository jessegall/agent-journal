<?php

declare(strict_types=1);

namespace App\Pipelines\Support;

use App\Bus\Contracts\Pipable;
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

        return function (object $input) use ($round, $while): object {
            $stepInput = $input;

            while ($while($stepInput)) {
                $stepInput = $round($stepInput);
            }

            return $stepInput;
        };
    }
}
