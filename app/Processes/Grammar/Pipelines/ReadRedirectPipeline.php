<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipelines;

use App\Bus\Contracts\PipelineDefinition;
use App\Processes\Grammar\Pipes\ParseRedirectSubstitutions;
use App\Processes\Grammar\Pipes\ParseRedirectTarget;
use App\Processes\Grammar\UnparsedRedirect;
use App\Values\Redirect;

/**
 * A redirect operator with its target word or here-document; the substitutions in either are read as children.
 *
 * @implements PipelineDefinition<UnparsedRedirect, Redirect>
 */
final readonly class ReadRedirectPipeline implements PipelineDefinition
{
    public string $input = UnparsedRedirect::class;

    public string $output = Redirect::class;

    public function pipes(): array
    {
        return [
            ParseRedirectTarget::class,
            ParseRedirectSubstitutions::class,
        ];
    }
}
