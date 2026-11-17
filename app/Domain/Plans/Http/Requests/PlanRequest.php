<?php

declare(strict_types=1);

namespace App\Domain\Plans\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * The plan a record page shows, named by its route; an id that is no positive whole number in range is not found.
 */
final class PlanRequest extends FormRequest
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

        if (preg_match('/^[1-9][0-9]{0,18}$/', $value) !== 1 || (strlen($value) === 19 && strcmp($value, (string) PHP_INT_MAX) > 0)) {
            throw new NotFoundHttpException;
        }

        return (int) $value;
    }
}
