<?php

declare(strict_types=1);

namespace App\Declarations;

/**
 * A checked action route of an installed domain: its route name and URI, and the page or section whose visibility
 * guards it, taken from where it was declared.
 */
final readonly class RegisteredAction
{
    private function __construct(
        public DomainClient $owner,
        public ActionRoute $action,
        public string $routeName,
        public RoutePath $path,
        public string $uri,
        public RegisteredPage|RegisteredSection $guard,
    ) {}

    public static function of(DomainClient $owner, ActionRoute $action, RegisteredPage|RegisteredSection $guard): self
    {
        $routeName = $owner->fullKey('action', $action->name);
        $path = RoutePath::of($routeName, $action->path);
        $owner->assertInvokableController($routeName, $action->controller);

        return new self($owner, $action, $routeName, $path, $owner->uri($path), $guard);
    }
}
