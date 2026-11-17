<?php

declare(strict_types=1);

namespace App\Domain\Rules\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Which proposed rule to review, named by the route; an id that is no positive whole number in range is not found
 * before any work.
 */
final class ReviewRuleRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [];
    }

    public function ruleId(): int
    {
        $value = (string) $this->route('rule');

        if (preg_match('/^[1-9][0-9]{0,18}$/', $value) !== 1 || (strlen($value) === 19 && strcmp($value, (string) PHP_INT_MAX) > 0)) {
            throw new NotFoundHttpException;
        }

        return (int) $value;
    }
}
