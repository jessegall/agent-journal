<?php

declare(strict_types=1);

namespace App\Http\Middleware\Web;

use App\Actors\Contracts\CurrentActor;
use App\Exceptions\ProjectUnavailable;
use App\Projects\Contracts\ProjectDirectory;
use App\Projects\CurrentProject;
use App\Values\InboxMemberAuthority;
use App\Values\ProjectSelection;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use PhpOption\Option;
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
        private CurrentProject $selections,
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
        $header = Option::fromValue($request->headers->get(self::HEADER));
        $query = Option::fromValue($request->query->get($parameter))->map(fn (mixed $value) => (string) $value);

        if ($header->isDefined() && $query->isDefined() && $header->get() !== $query->get()) {
            throw ProjectUnavailable::forChoice();
        }

        return $header->orElse($query);
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
