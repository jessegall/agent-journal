<?php

declare(strict_types=1);

namespace App\Http\Middleware\Web;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Projects\ProjectDirectory;
use App\Exceptions\ProjectUnavailable;
use App\Support\Projects\ProjectSelectionStore;
use App\Values\InboxMemberAuthority;
use App\Values\ProjectSelection;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;
use Symfony\Component\HttpFoundation\Response;

/**
 * Installs the project a browser chose, named by the X-Journal-Project header or else the project query parameter;
 * with neither the owner sees All projects. A choice the browser may not make is answered as unavailable.
 */
final readonly class SelectProject
{
    public const string HEADER = 'X-Journal-Project';

    public function __construct(
        private ProjectDirectory $projects,
        private ProjectSelectionStore $selections,
        private CurrentActor $actors,
    ) {}

    /**
     * @param  Closure(Request): Response  $next
     *
     * @throws ProjectUnavailable
     */
    public function handle(Request $request, Closure $next): Response
    {
        $this->chosenOf($request)->forAll(function (string $projectId): void {
            $this->assertChoosable($projectId);
            $this->selections->select(ProjectSelection::of($projectId));
        });

        return $next($request);
    }

    /**
     * The project the request names; header and query naming two projects is refused.
     *
     * @return Option<string>
     *
     * @throws ProjectUnavailable
     */
    private function chosenOf(Request $request): Option
    {
        $parameter = ProjectSelection::ADDRESS_PARAMETER;
        $header = $request->headers->has(self::HEADER) ? $request->headers->get(self::HEADER, '') : null;
        $query = $request->query->has($parameter) ? $request->query->getString($parameter) : null;

        if ($header !== null && $query !== null && $header !== $query) {
            throw ProjectUnavailable::forChoice();
        }

        $chosen = $header ?? $query;

        if ($chosen === null) {
            return None::create();
        }

        return new Some((string) $chosen);
    }

    /**
     * One answer for a malformed id, a project not listed and a guest choosing at all, so none tells what exists.
     *
     * @throws ProjectUnavailable
     */
    private function assertChoosable(string $projectId): void
    {
        $isGuest = $this->actors->hasActor() && $this->actors->authority() instanceof InboxMemberAuthority;

        if ($isGuest || ! Str::isUlid($projectId) || ! $this->projects->isListed($projectId)) {
            throw ProjectUnavailable::forChoice();
        }
    }
}
