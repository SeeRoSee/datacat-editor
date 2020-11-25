import React, {FC} from "react";
import {
    CollectionDetailPropsFragment,
    CollectsPropsFragment,
    GetCollectionEntryDocument,
    PropertyTreeDocument,
    useDeleteEntryMutation,
    useGetCollectionEntryQuery
} from "../../generated/types";
import {Typography} from "@material-ui/core";
import useCollects from "../../hooks/useCollects";
import {useSnackbar} from "notistack";
import {FormSet} from "../../components/forms/FormSet";
import MetaFormSet from "../../components/forms/MetaFormSet";
import Button from "@material-ui/core/Button";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import NameFormSet from "../../components/forms/NameFormSet";
import DescriptionFormSet from "../../components/forms/DescriptionFormSet";
import VersionFormSet from "../../components/forms/VersionFormSet";
import {ClassEntity} from "../../domain";
import FormView, {FormProps} from "./FormView";
import useDocumentedBy from "../../hooks/useDocumentedBy";
import useCollectedBy from "../../hooks/useCollectedBy";

const DomainGroupForm: FC<FormProps<CollectionDetailPropsFragment>> = (props) => {
    const {id, onDelete} = props;
    const {enqueueSnackbar} = useSnackbar();

    const baseOptions = {
        refetchQueries: [{query: PropertyTreeDocument}]
    };

    // fetch domain model
    const {loading, error, data} = useGetCollectionEntryQuery({
        fetchPolicy: "network-only",
        variables: {id}
    });
    let entry = data?.node as CollectionDetailPropsFragment | undefined;
    const [deleteEntry] = useDeleteEntryMutation(baseOptions);

    const collects = useCollects({
        id,
        relationships: entry?.collects.nodes || [],
        optionsSearchInput: {
            pageSize: 100,
            tagged: ClassEntity.tags
        },
        renderLabel(relationship?: CollectsPropsFragment): React.ReactNode {
            return relationship ? `Klassen (${relationship.id})` : `Klassen`;
        },
        refetchQueries: [
            {query: PropertyTreeDocument},
            {query: GetCollectionEntryDocument, variables: {id}}
        ]
    });

    const documentedBy = useDocumentedBy({
        relationships: entry?.documentedBy.nodes ?? [],
    });

    const collectedBy = useCollectedBy({
        relationships: entry?.collectedBy.nodes ?? [],
        emptyMessage: "In keinen Fachmodellen aufgeführt."
    });

    if (loading) return <Typography>Lade Gruppe..</Typography>;
    if (error || !entry) return <Typography>Es ist ein Fehler aufgetreten..</Typography>;

    const handleOnDelete = async () => {
        await deleteEntry({variables: {id}});
        enqueueSnackbar("Gruppe gelöscht.")
        onDelete(entry!);
    };

    return (
        <FormView>
            <NameFormSet
                catalogEntryId={id}
                names={entry.names}
            />

            <DescriptionFormSet
                catalogEntryId={id}
                descriptions={entry.descriptions}
            />

            <VersionFormSet
                id={id}
                versionId={entry.versionId}
                versionDate={entry.versionDate}
            />

            <FormSet
                title="Klassen"
                description="Klassen, die dieser Gruppe zugeordnet sind."
            >
                {collects}
            </FormSet>

            <MetaFormSet entry={entry}/>

            <FormSet title="Referenzen...">
                {documentedBy}
            </FormSet>

            <FormSet
                title="Fachmodelle..."
                description="Zeigt auf, welche Fachmodelle diese Gruppe nutzen."
            >
                <div>{collectedBy}</div>
            </FormSet>

            <Button
                variant="contained"
                color="primary"
                startIcon={<DeleteForeverIcon/>}
                onClick={handleOnDelete}
            >
                Löschen
            </Button>
        </FormView>
    );
}

export default DomainGroupForm;
