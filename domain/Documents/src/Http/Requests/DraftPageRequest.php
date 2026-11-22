<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Requests;

use App\Http\Requests\Web\Concerns\ReadsRouteNumber;
use Domain\Documents\Values\DraftTarget;
use Illuminate\Foundation\Http\FormRequest;

/**
 * An editor action on a document page: the document from the route, and for a save or close the token, the version
 * the editor holds and its text.
 */
final class DraftPageRequest extends FormRequest
{
    use ReadsRouteNumber;

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'token' => ['sometimes', 'required', 'string'],
            'version' => ['sometimes', 'required', 'integer', 'min:1'],
            'title' => ['sometimes', 'string'],
            'abstract' => ['sometimes', 'string'],
            'body' => ['sometimes', 'string'],
            'reason' => ['sometimes', 'string'],
        ];
    }

    public function documentNumber(): int
    {
        return $this->routeNumber('document');
    }

    public function target(): DraftTarget
    {
        return new DraftTarget(
            (string) $this->documentNumber(),
            $this->string('token')->toString(),
            $this->integer('version'),
        );
    }

    public function title(): string
    {
        return $this->string('title')->toString();
    }

    public function abstract(): string
    {
        return $this->string('abstract')->toString();
    }

    public function reason(): string
    {
        return $this->string('reason')->toString();
    }

    public function body(): string
    {
        return (string) $this->input('body', '');
    }
}
