<?php

declare(strict_types=1);

namespace Domain\Sequences\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * The address of one stored sequence's reader: its id, or the page is not found.
 */
final class SequenceRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [];
    }

    public function sequenceId(): string
    {
        $id = (string) $this->route('sequence');

        if (Str::isUlid($id)) {
            return strtolower($id);
        }

        throw new NotFoundHttpException();
    }
}
