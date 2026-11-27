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

        return function (object $carried, Closure $next) use ($round, $while): object {
            $value = $carried;

            while ($while($value)) {
                $value = $round($value, fn (object $roundEnd) => $roundEnd);
            }

            return $next($value);
        };
    }

    public function carriesOn(array $carried, Closure $follow): array
    {
        return array_values(array_unique([...$carried, ...$follow($this->steps, $carried)]));
    }
}
