<?php

declare(strict_types=1);

namespace App\Contracts\Projects;

use App\Exceptions\ProjectNotChosen;
use App\Values\ProjectOwner;
use PhpOption\Option;

/**
 * Where an entry's create goes: the project its sender chose, else the one selected.
 */
interface ProjectDestination
{
    /**
     * The choice of a may-be-global create that names Global.
     */
    public const string GLOBAL = ProjectOwner::GLOBAL_KEY;

    /**
     * The id of the project a create goes to.
     *
     * @param  Option<string>  $chosen
     *
     * @throws ProjectNotChosen when nothing was chosen and no single project is selected
     */
    public function projectFor(Option $chosen): string;

    /**
     * The owner of a may-be-global create: the chosen project, Global, else the selected project.
     *
     * @param  Option<string>  $chosen  a project id or GLOBAL
     *
     * @throws ProjectNotChosen when nothing was chosen and no single project is selected
     */
    public function ownerFor(Option $chosen): ProjectOwner;
}
