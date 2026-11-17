<?php

declare(strict_types=1);

namespace App\Domain\Plans\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Which plan to start, named by the route; an id that is no positive whole number in range is not found.
 */
final class StartPlanRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [];
    }

    public function planId(): int
    {
        $value = (string) $this->route('plan');
        $isPositiveNumber = preg_match('/^[1-9][0-9]{0,18}$/', $value) === 1;
        $fitsInAnInteger = strlen($value) < 19 || strcmp($value, (string) PHP_INT_MAX) <= 0;

        if (! $isPositiveNumber || ! $fitsInAnInteger) {
            throw new NotFoundHttpException;
        }

        return (int) $value;
    }
}
