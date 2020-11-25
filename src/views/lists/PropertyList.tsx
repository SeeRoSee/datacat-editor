import React, {FC} from "react";
import {useHistory, useParams} from "react-router-dom";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Paper} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import {SearchResultPropsFragment, useFindConceptQuery} from "../../generated/types";
import {PropertyEntity} from "../../domain";
import CatalogEntryList from "../../components/CatalogEntryList";
import SearchField from "../../components/forms/SearchInput";
import useQuerying from "../../hooks/useQuerying";
import usePaging from "../../hooks/usePaging";
import PropertyForm from "../forms/PropertyForm";

const useStyles = makeStyles(theme => ({
    paper: {
        padding: theme.spacing(2),
    },
    hint: {
        flexGrow: 1,
        textAlign: "center",
        color: theme.palette.grey[600],
        padding: theme.spacing(5)
    }
}));

const PropertyList: FC = () => {
    const classes = useStyles();

    const history = useHistory();
    const {id} = useParams<{ id?: string }>()

    const querying = useQuerying("", 0, 25);
    const {
        query: [query, setQuery],
        pageSize: [pageSize],
        pageNumber: [pageNumber]
    } = querying;

    const {data, refetch} = useFindConceptQuery({
        variables: {
            input: {
                entityTypeIn: [PropertyEntity.entityType],
                // tagged: PropertyEntity.tags,
                query,
                pageSize,
                pageNumber
            }
        }
    });

    const paging = usePaging({pagination: querying, totalElements: data?.search.totalElements});

    const handleOnSelect = (value: SearchResultPropsFragment) => {
        history.push(`/${PropertyEntity.path}/${value.id}`);
    };

    const handleOnDelete = async () => {
        history.push(`/${PropertyEntity.path}`);
        await refetch();
    };

    return (
        <Grid container spacing={1}>
            <Grid item xs={5}>
                <Paper className={classes.paper}>
                    <Typography variant="h5">
                        Alle {PropertyEntity.titlePlural}
                    </Typography>
                    <SearchField value={query} onChange={setQuery}/>
                    <CatalogEntryList
                        data={data?.search.nodes ?? []}
                        pagingOptions={paging}
                        onSelect={handleOnSelect}
                    />
                </Paper>
            </Grid>
            <Grid item xs={7}>
                <Paper className={classes.paper}>
                    <Typography variant="h5">
                        {PropertyEntity.title} bearbeiten
                    </Typography>
                    {id ? (
                        <PropertyForm id={id} onDelete={handleOnDelete}/>
                    ) : (
                        <Typography className={classes.hint} variant="body1">
                            {PropertyEntity.title} in der Listenansicht auswählen um Eigenschaften anzuzeigen.
                        </Typography>
                    )}
                </Paper>
            </Grid>
        </Grid>
    )
}

export default PropertyList;

